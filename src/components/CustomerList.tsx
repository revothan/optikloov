import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, getMonth, getDate } from "date-fns";
import { Loader2, Cake, User, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { MessageTemplateDialog } from "@/components/admin/MessageTemplateDialog";
import { MigrateCustomersButton } from "@/components/admin/MigrateCustomersButton";
import { Badge } from "@/components/ui/badge";

export function CustomerTable() {
  // Fetch customers data
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  // Function to check if today is someone's birthday (ignoring year)
  const isBirthdayToday = (birthDate: string) => {
    if (!birthDate) return false;
    const today = new Date();
    const birth = parseISO(birthDate);
    return (
      getMonth(today) === getMonth(birth) && getDate(today) === getDate(birth)
    );
  };

  // Function to get days until next birthday
  const getDaysUntilBirthday = (birthDate: string) => {
    if (!birthDate) return Infinity;

    const today = new Date();
    const birth = parseISO(birthDate);

    // Create a date for this year's birthday
    const thisBirthday = new Date(
      today.getFullYear(),
      getMonth(birth),
      getDate(birth),
    );

    // If birthday has passed this year, use next year's birthday
    if (thisBirthday < today) {
      thisBirthday.setFullYear(today.getFullYear() + 1);
    }

    return Math.ceil(
      (thisBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  // Sort customers by birthday proximity
  const sortedCustomers = [...customers].sort((a, b) => {
    const daysUntilA = getDaysUntilBirthday(a.birth_date);
    const daysUntilB = getDaysUntilBirthday(b.birth_date);
    return daysUntilA - daysUntilB;
  });

  // Format birthday (only month and day)
  const formatBirthday = (birthDate: string) => {
    if (!birthDate) return "-";
    const date = parseISO(birthDate);
    return format(date, "dd MMM");
  };

  // Count birthdays today
  const birthdaysToday = sortedCustomers.filter((customer) =>
    isBirthdayToday(customer.birth_date),
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4">
              <CardTitle>Customers</CardTitle>
              <MessageTemplateDialog />
              <MigrateCustomersButton />
            </div>
            {birthdaysToday > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {birthdaysToday} birthday{birthdaysToday > 1 ? "s" : ""} today!
                🎉
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-pink-200"></div>
            <span>Birthday Today</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead>Days Until Birthday</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCustomers.map((customer) => {
              const isToday = isBirthdayToday(customer.birth_date);
              const daysUntil = getDaysUntilBirthday(customer.birth_date);
              const isMember = customer.membership_type !== "Guest";

              return (
                <TableRow
                  key={customer.id}
                  className={cn(
                    isToday && "bg-pink-50 hover:bg-pink-100",
                    "transition-colors",
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {customer.name}
                      {isToday && <Cake className="h-4 w-4 text-pink-500" />}
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {isMember ? (
                      <Badge
                        variant="default"
                        className="flex items-center gap-1"
                      >
                        <User className="h-3 w-3" /> Member
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <UserMinus className="h-3 w-3" /> Guest
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatBirthday(customer.birth_date)}</TableCell>
                  <TableCell>
                    {customer.birth_date ? (
                      isToday ? (
                        <span className="text-pink-500 font-medium">
                          Today! 🎂
                        </span>
                      ) : (
                        `${daysUntil} days`
                      )
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(customer.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    {customer.phone && (
                      <WhatsAppButton
                        phone={customer.phone}
                        name={customer.name}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default CustomerTable;
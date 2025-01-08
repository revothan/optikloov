import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings2, Loader2 } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  content: string;
}

export function MessageTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", content: "" });
  const queryClient = useQueryClient();

  // Fetch templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["message-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("message_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Add template mutation
  const addTemplateMutation = useMutation({
    mutationFn: async (template: { name: string; content: string }) => {
      const { data, error } = await supabase
        .from("message_templates")
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-templates"] });
      setNewTemplate({ name: "", content: "" });
      toast.success("Template added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add template");
      console.error("Error adding template:", error);
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("message_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-templates"] });
      toast.success("Template deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete template");
      console.error("Error deleting template:", error);
    },
  });

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      addTemplateMutation.mutate(newTemplate);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplateMutation.mutate(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Message Templates</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Templates */}
          <div className="space-y-4">
            <h3 className="font-medium">Existing Templates</h3>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{template.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-destructive"
                        disabled={deleteTemplateMutation.isPending}
                      >
                        {deleteTemplateMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted p-2 rounded">
                      {template.content}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Template */}
          <div className="space-y-4">
            <h3 className="font-medium">Add New Template</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                  placeholder="e.g., Follow-up Message"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateContent">Message Content</Label>
                <div className="text-sm text-muted-foreground mb-2">
                  Use {"{name}"} to insert customer name
                </div>
                <Textarea
                  id="templateContent"
                  value={newTemplate.content}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, content: e.target.value })
                  }
                  placeholder="Enter your message template..."
                  rows={5}
                />
              </div>
              <Button
                onClick={handleAddTemplate}
                disabled={
                  !newTemplate.name ||
                  !newTemplate.content ||
                  addTemplateMutation.isPending
                }
              >
                {addTemplateMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Adding...</span>
                  </div>
                ) : (
                  "Add Template"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

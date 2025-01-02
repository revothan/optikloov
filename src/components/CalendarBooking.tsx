import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const CalendarBooking = () => {
  const NAMESPACE = "periksa-mata";
  const CAL_LINK = "optikloov/periksa-mata";

  const calConfig = {
    layout: "month_view" as const,
    theme: "light" as const,
    hideEventTypeDetails: false,
    styles: {
      brandColor: "#000000"
    }
  };

  useEffect(() => {
    const initializeCal = async () => {
      try {
        const cal = await getCalApi({ namespace: NAMESPACE });
        cal("ui", calConfig);
      } catch (error) {
        console.error("Failed to initialize Cal:", error);
      }
    };

    initializeCal();
  }, []);

  return (
    <div className="w-full h-screen">
      <Cal
        namespace={NAMESPACE}
        calLink={CAL_LINK}
        config={calConfig}
        className="w-full h-full"
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      />
    </div>
  );
};

export default CalendarBooking;
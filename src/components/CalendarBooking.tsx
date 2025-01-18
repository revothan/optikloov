import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const CAL_LINK = "optikloov/30min";

const CalendarBooking = () => {
  const calConfig = {
    layout: "month_view",
    theme: "light" as const,
    hideEventTypeDetails: false,
    styles: {
      branding: {
        brandColor: "#000000"
      }
    }
  };

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        layout: calConfig.layout,
        theme: calConfig.theme,
        hideEventTypeDetails: calConfig.hideEventTypeDetails,
        styles: calConfig.styles
      });
    })();
  }, []);

  return (
    <div className="w-full h-[600px]">
      <Cal
        calLink={CAL_LINK}
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
        config={{
          layout: calConfig.layout,
          theme: calConfig.theme,
          hideEventTypeDetails: calConfig.hideEventTypeDetails,
          styles: calConfig.styles
        }}
      />
    </div>
  );
};

export default CalendarBooking;
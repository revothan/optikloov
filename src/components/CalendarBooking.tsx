import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const CalendarBooking = () => {
  const CAL_LINK = "optikloov/periksa-mata";

  const calConfig = {
    layout: "month_view",
    theme: "light",
    hideEventTypeDetails: "false", // Changed to string to match type
    styles: {
      branding: { brandColor: "#000000" } // Updated to match Cal.com's type
    }
  };

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", calConfig);
    })();
  }, []);

  return (
    <div className="w-full">
      <Cal
        calLink={CAL_LINK}
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
        config={calConfig}
      />
    </div>
  );
};

export default CalendarBooking;
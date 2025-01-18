import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const CalendarBooking = () => {
  const CAL_LINK = "optikloov/periksa-mata";

  const calConfig = {
    layout: "month_view",
    theme: "light",
    hideEventTypeDetails: false, // Changed from "false" to false
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
        theme: calConfig.theme,
        hideEventTypeDetails: calConfig.hideEventTypeDetails,
        styles: {
          branding: {
            brandColor: calConfig.styles.branding.brandColor
          }
        }
      });
    })();
  }, []);

  return (
    <div className="w-full">
      <Cal
        calLink={CAL_LINK}
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
        config={{
          theme: calConfig.theme,
          hideEventTypeDetails: calConfig.hideEventTypeDetails
        }}
      />
    </div>
  );
};

export default CalendarBooking;
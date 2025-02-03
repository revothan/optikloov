import { UseFormReturn } from "react-hook-form";
import { EyeField } from "./prescription/EyeField";

interface PrescriptionFieldsProps {
  form: UseFormReturn<any>;
  index: number;
  side: "left" | "right";
}

export function PrescriptionFields({
  form,
  index,
  side,
}: PrescriptionFieldsProps) {
  const getNextFieldName = (currentField: string) => {
    const fieldOrder = ["sph", "cyl", "axis", "add_power", "mpd"];

    const currentIndex = fieldOrder.indexOf(currentField);
    if (currentIndex === fieldOrder.length - 1) {
      // If we're on the last field of right eye, move to left eye
      if (side === "right") {
        return "left_eye.sph";
      }
      // If we're on the last field of left eye, stop
      return null;
    }
    return `${side}_eye.${fieldOrder[currentIndex + 1]}`;
  };

  const handleFieldComplete = (currentField: string) => {
    const nextField = getNextFieldName(currentField);
    if (nextField) {
      const element = document.querySelector(
        `[name="items.${index}.${nextField}"]`,
      );
      if (element) {
        (element as HTMLElement).focus();
      }
    }
  };

  return (
    <div>
      <h5 className="text-sm font-medium mb-2">
        {side === "right" ? "Right Eye (OD)" : "Left Eye (OS)"}
      </h5>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="sph"
          label="SPH"
          type="sph"
          onComplete={() => handleFieldComplete("sph")}
        />
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="cyl"
          label="CYL"
          type="cyl"
          onComplete={() => handleFieldComplete("cyl")}
        />
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="axis"
          label="AXIS"
          type="axis"
          onComplete={() => handleFieldComplete("axis")}
        />
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="add_power"
          label="ADD"
          type="add"
          onComplete={() => handleFieldComplete("add_power")}
        />
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="mpd"
          label="MPD"
          type="mpd"
          onComplete={() => handleFieldComplete("mpd")}
        />
      </div>
    </div>
  );
}


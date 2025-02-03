import { UseFormReturn } from "react-hook-form";
import { EyeField } from "./prescription/EyeField";

interface PrescriptionFieldsProps {
  form: UseFormReturn<any>;
  index: number;
  side: "left" | "right";
}

export function PrescriptionFields({ form, index, side }: PrescriptionFieldsProps) {
  return (
    <div>
      <h5 className="text-sm font-medium mb-2">
        {side === "right" ? "Right Eye (OD)" : "Left Eye (OS)"}
      </h5>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="sph"
          label="SPH"
          type="sph"
        />
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="cyl"
          label="CYL"
          type="cyl"
        />
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="axis"
          label="AXIS"
          type="axis"
        />
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="add_power"
          label="ADD"
          type="add"
        />
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="mpd"
          label="MPD"
          type="mpd"
        />
        <EyeField
          form={form}
          index={index}
          side={side}
          fieldName="dbl"
          label="DBL"
          type="dbl"
        />
      </div>
    </div>
  );
}
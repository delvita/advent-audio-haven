import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  const id = label.toLowerCase().replace(/\s+/g, '_');
  
  return (
    <div className="flex items-center gap-4">
      <Label htmlFor={`${id}_color`} className="min-w-[100px]">{label}</Label>
      <div className="flex gap-2 items-center flex-1">
        <Input
          type="color"
          id={`${id}_color_picker`}
          name={`${id}_color_picker`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 p-0 cursor-pointer"
          aria-label={`${label} Farbauswahl`}
        />
        <Input
          type="text"
          id={`${id}_color`}
          name={`${id}_color`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          pattern="^#[0-9A-Fa-f]{6}$"
          title="Gültige Hex-Farbe (z.B. #FF0000)"
          aria-label={`${label} Hex-Wert`}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
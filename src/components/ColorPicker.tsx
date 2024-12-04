import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  return (
    <div className="flex items-center gap-4">
      <Label className="min-w-[100px]">{label}</Label>
      <div className="flex gap-2 items-center flex-1">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 p-0 cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          pattern="^#[0-9A-Fa-f]{6}$"
          title="Gültige Hex-Farbe (z.B. #FF0000)"
        />
      </div>
    </div>
  );
};
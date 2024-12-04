import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerSettingsDB } from "@/types/player";
import { Pencil, Trash2 } from "lucide-react";

interface PlayerSettingsTableProps {
  settings?: PlayerSettingsDB;
  onEdit: (settings: PlayerSettingsDB) => void;
  onDelete: (settings: PlayerSettingsDB) => void;
}

export const PlayerSettingsTable = ({ settings, onEdit, onDelete }: PlayerSettingsTableProps) => {
  if (!settings) return null;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Gespeicherte Einstellungen</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Player Typ</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{settings.name}</TableCell>
            <TableCell>{settings.player_type}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(settings)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(settings)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};
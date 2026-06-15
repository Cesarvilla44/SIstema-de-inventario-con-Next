import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThemeChange: (theme: string) => void;
}

export function SettingsModal({ open, onOpenChange, onThemeChange }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border sm:max-w-md bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Configuración</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="dark:text-slate-700">Tema</Label>
            <div className="flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => onThemeChange("light")}
              >
                Claro
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onThemeChange("dark")}
              >
                Oscuro
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="text-slate-900 dark:text-slate-400">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

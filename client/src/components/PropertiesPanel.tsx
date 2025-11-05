import { RotateCw, Move, Maximize2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CanvasFurnitureItem } from "@shared/schema";

interface PropertiesPanelProps {
  selectedItem: CanvasFurnitureItem | null;
  onUpdateItem: (updates: Partial<CanvasFurnitureItem>) => void;
}

export function PropertiesPanel({ selectedItem, onUpdateItem }: PropertiesPanelProps) {
  if (!selectedItem) {
    return (
      <div className="w-[300px] bg-sidebar border-l border-sidebar-border flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center">
            <Move className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Selecione um móvel para editar as propriedades
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[300px] bg-sidebar border-l border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold font-serif">Propriedades</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Posição</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">X</Label>
                <div className="text-sm font-medium bg-muted rounded-md px-3 py-2">
                  {Math.round(selectedItem.x)}px
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Y</Label>
                <div className="text-sm font-medium bg-muted rounded-md px-3 py-2">
                  {Math.round(selectedItem.y)}px
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Tamanho</Label>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Largura</Label>
                  <span className="text-xs font-medium">{Math.round(selectedItem.width)}px</span>
                </div>
                <Slider
                  value={[selectedItem.width]}
                  onValueChange={([width]) => onUpdateItem({ width })}
                  min={50}
                  max={500}
                  step={5}
                  className="w-full"
                  data-testid="slider-width"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Altura</Label>
                  <span className="text-xs font-medium">{Math.round(selectedItem.height)}px</span>
                </div>
                <Slider
                  value={[selectedItem.height]}
                  onValueChange={([height]) => onUpdateItem({ height })}
                  min={50}
                  max={500}
                  step={5}
                  className="w-full"
                  data-testid="slider-height"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RotateCw className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Rotação</Label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Ângulo</Label>
                <span className="text-xs font-medium">{Math.round(selectedItem.rotation)}°</span>
              </div>
              <Slider
                value={[selectedItem.rotation]}
                onValueChange={([rotation]) => onUpdateItem({ rotation })}
                min={0}
                max={360}
                step={5}
                className="w-full"
                data-testid="slider-rotation"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Camada</Label>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground flex-1">Z-Index</Label>
              <span className="text-sm font-medium bg-muted rounded-md px-3 py-2">
                {selectedItem.zIndex}
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

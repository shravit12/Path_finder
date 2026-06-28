"use client";

import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export default function Toolbar() {
  return (
    <div className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900">

      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">

        <h1 className="text-2xl font-bold">
          AlgoVision
        </h1>

        <div className="flex gap-3">

          <Button>Start</Button>

          <Button variant="secondary">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

        </div>

      </div>

    </div>
  );
}
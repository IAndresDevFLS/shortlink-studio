import { Check, Copy, Download, QrCode, X } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

interface QrModalProps {
  open: boolean;
  url: string;
  onClose: () => void;
}

export function QrModal({ open, url, onClose }: QrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, url, {
      width: 512,
      margin: 1,
      color: { dark: "#1e293b", light: "#ffffff" },
    })
      .then(() => {
        // La librería fija el tamaño con estilos en línea; lo devolvemos al
        // control del diseño para que el QR escale de forma responsiva.
        canvas.style.width = "";
        canvas.style.height = "";
      })
      .catch(() => undefined);
  }, [open, url]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "compacto-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-title"
        className="modal-enter w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary"
              aria-hidden="true"
            >
              <QrCode className="size-5" />
            </span>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Shortlinks</p>
              <h2 id="qr-title" className="font-display text-2xl font-bold text-foreground">Código QR</h2>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon-lg" aria-label="Cerrar modal" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </header>

        <div className="space-y-6 px-6 py-6 sm:px-8">
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            Escanea el código con la cámara del teléfono para abrir el enlace.
          </p>

          <div className="mx-auto w-fit rounded-2xl border border-border bg-secondary/60 p-4 shadow-subtle">
            <div className="relative rounded-xl bg-card p-4 shadow-subtle">
              <span aria-hidden="true" className="absolute left-2 top-2 size-4 rounded-tl-md border-l-2 border-t-2 border-primary" />
              <span aria-hidden="true" className="absolute right-2 top-2 size-4 rounded-tr-md border-r-2 border-t-2 border-primary" />
              <span aria-hidden="true" className="absolute bottom-2 left-2 size-4 rounded-bl-md border-b-2 border-l-2 border-primary" />
              <span aria-hidden="true" className="absolute bottom-2 right-2 size-4 rounded-br-md border-b-2 border-r-2 border-primary" />
              <canvas ref={canvasRef} className="block size-56 sm:size-64" aria-label={`Código QR de ${url}`} role="img" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-foreground px-4 py-3">
            <p className="truncate font-mono text-sm text-background" aria-label="Enlace corto">
              {url}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-background hover:bg-background/15 hover:text-background"
              aria-label={copied ? "Enlace copiado" : "Copiar enlace"}
              onClick={handleCopy}
            >
              {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Button type="button" variant="outline" className="h-11 rounded-full px-6" onClick={onClose}>
            Cerrar
          </Button>
          <Button type="button" variant="premium" className="h-11 rounded-full px-6" onClick={handleDownload}>
            <Download className="size-4" /> Descargar PNG
          </Button>
        </footer>
      </section>
    </div>
  );
}

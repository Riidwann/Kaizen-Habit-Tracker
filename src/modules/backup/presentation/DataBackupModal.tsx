import React, { useRef, useState } from "react";
import { Modal } from "@/shared/presentation/Modal";
import { Button } from "@/shared/presentation/Button";
import {
  Download,
  Upload,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileJson,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { BackupController, useBackupController } from "./useBackupController";
import { cn } from "@/shared/presentation/utils";

export interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  controller?: BackupController;
  className?: string;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  controller: customController,
  className,
}) => {
  const defaultController = useBackupController();
  const controller = customController || defaultController;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      controller.handleImportFile(files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      controller.handleImportFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmReset = async () => {
    const success = await controller.handleClearAllData();
    if (success) {
      setShowResetConfirm(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manajemen Data & Cadangan"
      description="Data Anda 100% tersimpan secara privat di peramban lokal. Buat cadangan JSON atau pulihkan kapan saja."
      className={cn("max-w-xl", className)}
    >
      <div className="space-y-5 py-2">
        {/* Alerts */}
        {controller.statusMessage && (
          <div
            role="status"
            className="flex items-center gap-2.5 p-3.5 text-xs rounded-xl bg-sage-50 text-sage-800 dark:bg-sage-950/40 dark:text-sage-200 border border-sage-200 dark:border-sage-800 transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 shrink-0" />
            <p className="font-medium">{controller.statusMessage}</p>
          </div>
        )}

        {controller.errorMessage && (
          <div
            role="alert"
            className="flex items-center gap-2.5 p-3.5 text-xs rounded-xl bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900 transition-all"
          >
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <p className="font-medium">{controller.errorMessage}</p>
          </div>
        )}

        {/* Section 1: Export Data */}
        <div className="rounded-xl border border-sand-200 dark:border-charcoal-700 bg-sand-50/60 dark:bg-charcoal-800/40 p-4 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                <h3 className="text-sm font-semibold text-charcoal-800 dark:text-sand-100">
                  Cadangkan Data (Export)
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 dark:text-sand-400">
                Ekspor semua target Kaizen, micro-action, dan refleksi harian ke dalam berkas JSON.
              </p>
              {controller.lastExportedAt && (
                <p className="text-[11px] text-sage-700 dark:text-sage-300 pt-0.5">
                  Terakhir diunduh hari ini pukul {controller.lastExportedAt}
                </p>
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={controller.handleExport}
              disabled={controller.isExporting}
              className="w-full sm:w-auto shrink-0 font-medium justify-center"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              {controller.isExporting ? "Menyiapkan..." : "Unduh Cadangan JSON"}
            </Button>
          </div>
        </div>

        {/* Section 2: Import Data */}
        <div className="rounded-xl border border-sand-200 dark:border-charcoal-700 bg-sand-50/60 dark:bg-charcoal-800/40 p-4 transition-all">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-semibold text-charcoal-800 dark:text-sand-100">
                Pulihkan Cadangan (Restore)
              </h3>
            </div>
            <p className="text-xs text-charcoal-500 dark:text-sand-400">
              Unggah file <code className="text-[11px] bg-sand-200/60 dark:bg-charcoal-700 px-1 py-0.5 rounded">.json</code> cadangan KaizenFlow untuk memulihkan seluruh data.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileChange}
              data-testid="backup-file-input"
              className="hidden"
            />

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleTriggerFileInput}
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                isDragOver
                  ? "border-sage-500 bg-sage-50/50 dark:bg-sage-950/20"
                  : "border-sand-300 dark:border-charcoal-600 hover:border-sand-400 dark:hover:border-charcoal-500"
              )}
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <FileJson className="w-6 h-6 text-charcoal-400 dark:text-sand-400" />
                <span className="text-xs font-medium text-charcoal-700 dark:text-sand-200">
                  {controller.isImporting
                    ? "Memvalidasi & memulihkan data..."
                    : "Pilih File Cadangan atau Tarik ke Sini"}
                </span>
                <span className="text-[11px] text-charcoal-400 dark:text-sand-500">
                  Format JSON snapshot resmi KaizenFlow
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Sample Data */}
        <div className="rounded-xl border border-sand-200 dark:border-charcoal-700 bg-sand-50/60 dark:bg-charcoal-800/40 p-4 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                <h3 className="text-sm font-semibold text-charcoal-800 dark:text-sand-100">
                  Muat Contoh Data (Sample Data)
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 dark:text-sand-400">
                Isi aplikasi dengan 3 target Kaizen inspiratif (Kesehatan, Karier, Mindset) untuk mencoba fitur.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={controller.handleLoadSampleData}
              disabled={controller.isLoadingSample}
              className="w-full sm:w-auto shrink-0 font-medium justify-center"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-sage-600" />
              {controller.isLoadingSample ? "Memuat..." : "Muat Contoh Data"}
            </Button>
          </div>
        </div>

        {/* Section 4: Safe Reset All Data */}
        <div className="rounded-xl border border-red-200/80 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20 p-4 transition-all">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">
                    Reset Semua Data
                  </h3>
                </div>
                <p className="text-xs text-red-700/80 dark:text-red-300/80">
                  Menghapus semua target, micro-action, dan riwayat refleksi secara permanen dari peramban ini.
                </p>
              </div>

              {!showResetConfirm ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full sm:w-auto shrink-0 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/50 justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Reset Semua Data
                </Button>
              ) : null}
            </div>

            {showResetConfirm && (
              <div className="p-3 bg-red-100/60 dark:bg-red-950/50 rounded-lg border border-red-300/70 dark:border-red-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs text-red-800 dark:text-red-300">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan.</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResetConfirm(false)}
                    className="text-xs text-charcoal-600 dark:text-sand-300"
                  >
                    Batal
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleConfirmReset}
                    disabled={controller.isClearing}
                    className="text-xs font-semibold"
                  >
                    {controller.isClearing ? "Menghapus..." : "Yakin Hapus Semua Data?"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-charcoal-400 dark:text-sand-500">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
          <span>Privasi terjaga: Tidak ada data yang dikirim ke server luar.</span>
        </div>
      </div>
    </Modal>
  );
};

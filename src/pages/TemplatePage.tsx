import { TopBar, PageHeader } from "@/src/components/ui";

export const TemplatePage = ({ title, desc, onBack }: { title: string; desc: string; onBack: () => void }) => (
  <div className="min-h-[100dvh] bg-warm-gray-50 pb-10">
    <TopBar onBack={onBack} />
    <PageHeader eyebrow="Coming soon" line1={title} line2="準備中。" desc={desc} />
    <div className="px-6">
      <div className="border-t border-warm-gray-800/80 py-6 text-[13px] tracking-[0.12em] text-warm-gray-600">這個單元還在整理中，完成後會第一時間通知你。</div>
    </div>
  </div>
);

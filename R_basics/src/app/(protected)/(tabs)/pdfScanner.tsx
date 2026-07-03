import { Alert, Text, View } from 'react-native';
import { ActivityRow, InfoCard, SectionHeader } from '../../../components/ui/Dashboard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { ScannerPanel } from '../../../components/ui/ScannerPanel';
import { ScreenHeader } from '../../../components/ui/ScreenHeader';

const documents = [
  { icon: 'document-text-outline' as const, title: 'Project proposal.pdf', meta: '8 pages · 2.4 MB' },
  { icon: 'document-text-outline' as const, title: 'Expense receipts.pdf', meta: '4 pages · 1.1 MB' },
];

export default function PdfScannerScreen() {
  return (
    <AppScreen>
      <ScreenHeader title="PDF Scanner" subtitle="Capture, enhance, and organize documents." />
      <ScannerPanel
        buttonLabel="Start scanning"
        description="Place your document on a flat surface with good lighting. We’ll detect the edges automatically."
        icon="document-text-outline"
        onPress={() => Alert.alert('Camera access', 'Connect the document-camera flow here.')}
        title="Scan a document"
      />

      <SectionHeader title="Scan quality" />
      <InfoCard>
        <View className="flex-row items-center justify-between">
          <View className="mr-4 flex-1">
            <Text className="font-bold text-slate-900">Auto enhancement</Text>
            <Text className="mt-1 text-sm leading-5 text-slate-500">Edge detection, cleanup, and readable contrast.</Text>
          </View>
          <Text className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">ON</Text>
        </View>
      </InfoCard>

      <SectionHeader action="See all" title="Recent documents" />
      {documents.map((item) => <ActivityRow key={item.title} {...item} />)}
    </AppScreen>
  );
}

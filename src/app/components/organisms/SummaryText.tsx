import React from 'react';
import { baseURL } from '@/app/api/index';
import { usePracticeContext } from '@/app/context/PracticeContext';
import axios from 'axios';
import { parseMarkdown } from '@/app/utils/parseMarkdown';
import {
  Document,
  Font,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import Button from '../atoms/Button';

Font.register({
  family: 'SpoqaHanSans',
  src: 'https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@01ff0283e4f36e159ffbf744b36e16ef742da6d8/Subset/SpoqaHanSans/SpoqaHanSansLight.ttf',
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'SpoqaHanSans',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
  },
});

const PDFDocument = ({ summary }: { summary: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Summary Document</Text>

      <View>{parseMarkdown(summary)}</View>
    </Page>
  </Document>
);

interface SummaryTextProps {
  noteId: number;
  folderId: number;
}

const SummaryText: React.FC<SummaryTextProps> = ({ folderId, noteId }) => {
  const { summary, setSummary } = usePracticeContext();

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/v1/folders/${folderId}/notes/${noteId}/summaries`
      );
      setSummary(response.data.information.summary);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  React.useEffect(() => {
    fetchSummary();
  }, [noteId]);

  return (
    <div className="w-full h-full overflow-y-auto bg-secondaryGray/45 text-white max-w-full mx-auto leading-10">
      {summary ? (
        <div>
          <p className="p-8">{summary}</p>
          <div className="z-40 fixed right-0 p-10 bottom-0">
            <PDFDownloadLink
              document={<PDFDocument summary={summary} />}
              fileName={`summary_${noteId}.pdf`}
            >
              <Button label="PDF 변환" />
            </PDFDownloadLink>
          </div>
        </div>
      ) : (
        <div className="flex h-[84vh] justify-center items-center">
          <p className="text-gray-400 text-lg">
            아직 생성된 요약문이 없어요. 다시 요약문을 생성해주세요!
          </p>
        </div>
      )}
    </div>
  );
};

export default SummaryText;

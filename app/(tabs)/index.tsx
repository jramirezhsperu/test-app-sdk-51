import { Button } from 'react-native';
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import { downloadPdfOnly, openPdf } from '@/utils/helpers';

export default function HomeScreen() {

  const handleDownloadAndOpen = async () => {
    const url = 'https://www.amkdelivery.com/test_apirest/test_apg/pdfs/GUITRA-V00199900004.pdf';
    const name = 'test-pdf';
    const uri = await downloadPdfOnly(url, name);
    await openPdf(uri);
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Button title='Descargar y Abrir Pdf' onPress={handleDownloadAndOpen} />
    </View>
  );
}
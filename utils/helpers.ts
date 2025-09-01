import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { Linking, Platform } from "react-native";

/**
 * Descarga un PDF y devuelve la ruta local
 */
export const downloadPdfOnly = async (url: string, name: string): Promise<string> => {
    if (Platform.OS === "web") {
        // en web no hay ruta local, devolvemos la url misma
        return url;
    }

    // solo mobile
    let fileUri = FileSystem.documentDirectory + `${name}.pdf`;

    if (Platform.OS === "android") {
        // guardar en cacheDirectory/Download
        const downloadsDir = FileSystem.cacheDirectory + "Download/";
        await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
        fileUri = downloadsDir + `${name}.pdf`;
    }

    // descargar archivo
    const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
    const downloadResult = await downloadResumable.downloadAsync();

    if (! downloadResult) {
        throw new Error("No se pudo descargar el PDF.");
    }

    return downloadResult.uri;
};

/**
 * Abre un PDF ya descargado
 */
export const openPdf = async (uri: string) => {
    if (Platform.OS === "web") {
        window.open(uri, "_blank");
        return;
    }

    if (Platform.OS === "android") {
        // convertir a content:// para abrir con “Abrir con…”
        const contentUri = await FileSystem.getContentUriAsync(uri);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: contentUri,
            flags: 1,
            type: "application/pdf",
        });
    } else {
        // iOS → visor nativo o compartir
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, {
                mimeType: "application/pdf",
                UTI: "com.adobe.pdf", 
            });
        } else {
            await Linking.openURL(uri);
        }
    }
};
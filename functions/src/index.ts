import { initializeApp } from "firebase-admin/app";
import { logger, storage } from "firebase-functions";
import { firestore } from "firebase-admin";

initializeApp();

enum FileStatusEnum {
  aguardando = "aguardando",
  aprovado_parcialmente = "aprovado-parcialmente",
  aprovado = "aprovado",
  reprovado = "reprovado",
}

export const onFinalizeUpload = storage
  .bucket()
  .object()
  .onFinalize((object: storage.ObjectMetadata) => {
    const { name, contentType, mediaLink } = object;
    if (!name) {
      logger.error("no name prop detected");
      return;
    }
    const [_, email, fileType, fileName] = name.toLowerCase().split("/");
    logger.info({ email, fileType, fileName }, contentType, mediaLink);

    const docRef = firestore().doc(`uploads/${email}/files/${fileType}`);
    docRef.set(
      {
        email,
        fileType,
        fileName,
        contentType,
        mediaLink,
        status: FileStatusEnum.aguardando,
      },
      { merge: true }
    );
  });

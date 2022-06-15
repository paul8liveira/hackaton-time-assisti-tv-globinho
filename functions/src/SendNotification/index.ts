/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {EUploadStatus} from "./enums/status.enum";
import {mailer, mailOptions} from "./config/nodemailer.config";

import {IDocumentFile, IFile, IUserData} from "./interfaces";

const logger = functions.logger;

export const sendNotificationMail = functions.firestore
    .document("/uploads/{docId}")
    .onUpdate(async (change: any, context: any) => {
      try {
        const studentId = context.params.docId;
        const {status} = change.after.data();

        if (status === EUploadStatus.PROCESSED) {
          logger.log("Receiving documents processed by OCR");

          const userData = await getUserDocumentsData(studentId);

          sendMail({
            ...userData,
          });

          logger.log(`Updating status to ${EUploadStatus.SENT_TO_ANALYSIS}`);
          return change.after.ref.set({
            status: EUploadStatus.SENT_TO_ANALYSIS,
          });
        }
        return null;
      } catch (error) {
        logger.error(error);
        return null;
      }
    });

function sendMail(context: unknown): void {
  logger.log("Sending notification mail");

  mailer.sendMail({
    ...mailOptions,
    // @ts-expect-error nodemailer wrong interface
    context,
  });

  logger.log("Notification mail sent");
}

async function getUserDocumentsData(userId: string): Promise<IUserData> {
  const db = admin.firestore();

  const files: IFile[] = [];

  const querySnapshot = await db.collection(`/uploads/${userId}/files/`).get();

  querySnapshot.forEach((doc: any) => {
    const {fileName, mediaLink} = doc.data() as IDocumentFile;
    files.push({type: fileName, url: mediaLink});
  });

  return {
    studentId: userId,
    files,
  };
}

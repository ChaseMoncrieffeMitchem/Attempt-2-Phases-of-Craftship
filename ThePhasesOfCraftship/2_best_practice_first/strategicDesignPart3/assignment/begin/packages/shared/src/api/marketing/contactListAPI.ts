export class ContactListAPI {
    async addEmailToList(email: string): Promise<boolean> {
      // Do the actual work
      console.log(
        `MailchimpContactList: Added ${email} list... for production usage.`,
      );
      return true;
    }

    async doNotAddEmailToList(email: string): Promise<boolean> {
      console.log(`Mailchimp contact list did not add ${email} to list`)
      return true
    }
  }
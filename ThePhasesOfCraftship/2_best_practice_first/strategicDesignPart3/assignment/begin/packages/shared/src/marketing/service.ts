import { ServerException } from "../../errorsAndExceptions/exceptions";
import { ContactListAPI } from "../api/marketing/contactListAPI";
export class MarketingService {
  constructor(private contactListAPI: ContactListAPI) {}

  async addEmailToList(email: string) {
    try {
      const result = await this.contactListAPI.addEmailToList(email);
      return result;
    } catch (err) {
      throw new ServerException();
    }
  }
}
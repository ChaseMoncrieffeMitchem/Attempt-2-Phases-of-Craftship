import { Server } from "http";
import request from "supertest";

export class RESTfulAPIDriver {
  private baseUrl: string;

  constructor(private http: Server, private port: number = 3000) {
    this.baseUrl = `http://localhost:${port}`;
  }

  post(url: string, data: any) {
    return request(this.baseUrl) // Using baseUrl with dynamic port
      .post(url)
      .set("Accept", "application/json")
      .send(data);
  }

  get(url: string) {
    return request(this.baseUrl) // Using baseUrl with dynamic port
      .get(url)
      .set("Accept", "application/json");
  }
}

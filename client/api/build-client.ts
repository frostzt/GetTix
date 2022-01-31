import axios, { AxiosRequestHeaders } from "axios";
import { IncomingMessage } from "http";

interface IBuildClient {
  req: IncomingMessage;
}

const buildClient = ({ req }: IBuildClient) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers as AxiosRequestHeaders,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export { buildClient };

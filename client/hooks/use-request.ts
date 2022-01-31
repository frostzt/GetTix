import axios from "axios";
import { useState } from "react";

export enum RequestTypes {
  GET = "get",
  POST = "post",
  PATCH = "patch",
}

interface IError {
  message: string;
  field?: string;
}

interface IUseRequest {
  body: any;
  url: string;
  method: RequestTypes;
  onSuccess?: (data: any) => void;
}

const useRequest = ({ url, body, method, onSuccess }: IUseRequest) => {
  const [errors, setErrors] = useState<null | IError[]>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error: any) {
      setErrors(error.response.data.errors);
    }
  };

  return { doRequest, errors };
};

export { useRequest };

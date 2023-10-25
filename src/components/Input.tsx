import React from "react";

type InputProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

// input コンポーネント。propsとlabelを取得する
export const Input = ({ label, ...props }: InputProps) => {
  return <input {...props} placeholder={label} />;
};

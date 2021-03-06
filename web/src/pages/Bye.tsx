import React from "react";
import { useByeQuery } from "../generated/graphql";

interface Props {}

export const Bye: React.FC<Props> = () => {
  const { data, loading, error } = useByeQuery({
    fetchPolicy: "network-only",
  });
  if (loading) {
    <div>Loading . . . </div>;
  }
  if (error) {
    console.log(error);
    return <div>err</div>;
  }
  if (!data) {
    <div>no data</div>;
  }
  return <div>{data?.bye}</div>;
};

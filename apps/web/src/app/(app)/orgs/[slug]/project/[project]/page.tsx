"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { parseStringPromise } from "xml2js";
import { useParams } from "next/navigation";
import { getOrganization } from "@/http/get-organization";

export default function Project() {
  const slugOrg = getOrganization();
  const { project: projectSlug } = useParams<{ project: string }>();

  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  async function handleSubmit() {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const jsonFiles = await Promise.all(
      files.map(async (file) => {
        const text = await file.text();
        const json = await parseStringPromise(text);
        return json;
      })
    );
  }

  const formatFileSize = (size: number) => {
    return size < 1024
      ? `${size} bytes`
      : size < 1048576
        ? `${(size / 1024).toFixed(2)} KB`
        : `${(size / 1048576).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Project - {projectSlug}</h1>
      <label className="block">
        <span className="sr-only">Choose files</span>
        <Input
          type="file"
          multiple
          accept=".xml"
          onChange={handleFileChange}
          className="block h-14 w-1/2 text-sm file:mr-4 file:rounded-full file:border file:border-foreground file:px-4 file:py-2 file:text-sm file:font-semibold"
        />
      </label>
      {files.length > 0 && (
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Upload Files"
          )}
        </Button>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => (
            <TableRow key={index}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveFile(index)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

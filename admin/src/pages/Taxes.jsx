import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
} from "@windmill/react-ui";
import { FiTrash2 } from "react-icons/fi";

import PageTitle from "@/components/Typography/PageTitle";
import TaxServices from "@/services/TaxServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const Taxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTaxes = async () => {
    try {
      const res = await TaxServices.getAll();
      setTaxes(res || []);
    } catch (err) {
      notifyError(err?.message || "Failed to load taxes");
    }
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || rate === "") {
      notifyError("Please enter tax name and rate");
      return;
    }

    try {
      setIsSubmitting(true);
      await TaxServices.add({
        name: name.trim(),
        rate: Number(rate),
      });
      notifySuccess("Tax created successfully");
      setName("");
      setRate("");
      loadTaxes();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle>Taxes</PageTitle>

      <div className="bg-white dark:bg-gray-800 shadow-xs rounded-lg p-6 mb-6">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-3 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Tax Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GST 18%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Rate (%)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
              value={rate}
              onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="18"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Tax"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xs rounded-lg p-4">
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Name</TableCell>
                <TableCell>Rate (%)</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {taxes?.length === 0 ? (
                <tr>
                  <TableCell colSpan={3}>No taxes created yet.</TableCell>
                </tr>
              ) : (
                taxes.map((tax) => (
                  <tr key={tax._id}>
                    <TableCell>{tax.name}</TableCell>
                    <TableCell>{tax.rate}</TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await TaxServices.delete(tax._id);
                            notifySuccess("Tax deleted successfully");
                            loadTaxes();
                          } catch (err) {
                            notifyError(
                              err?.response?.data?.message || err?.message
                            );
                          }
                        }}
                        className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Delete tax"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </TableCell>
                  </tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default Taxes;



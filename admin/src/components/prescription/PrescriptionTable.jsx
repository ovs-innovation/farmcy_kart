import { TableBody, TableCell, TableRow, Badge } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import Tooltip from "@/components/tooltip/Tooltip";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const PrescriptionTable = ({ prescriptions }) => {
  const { t } = useTranslation();
  const { showDateTimeFormat } = useUtilsFunction();

  return (
    <TableBody className="dark:bg-gray-900">
      {prescriptions?.map((prescription, i) => (
        <TableRow key={i + 1}>
          <TableCell>
            <span className="font-semibold uppercase text-xs">
              {prescription?._id ? prescription._id.substring(prescription._id.length - 4).toUpperCase() : ""}
            </span>
          </TableCell>

          <TableCell>
            <span className="text-sm">
              {showDateTimeFormat(prescription?.createdAt)}
            </span>
          </TableCell>

          <TableCell>
            <span className="text-sm">{prescription?.user?.name || "Guest"}</span>
          </TableCell>

          <TableCell>
            <span className="text-sm">{prescription?.user?.email || "N/A"}</span>
          </TableCell>

          <TableCell className="text-center">
            <span className="font-serif">
              {prescription?.status === "pending" && (
                <Badge type="warning">Pending</Badge>
              )}
              {prescription?.status === "processed" && (
                <Badge type="success">Approved</Badge>
              )}
              {prescription?.status === "rejected" && (
                <Badge type="danger">Rejected</Badge>
              )}
            </span>
          </TableCell>

          <TableCell className="text-right flex justify-end">
            <div className="flex justify-end text-right">
              <Link
                to={`/prescriptions/${prescription._id}`}
                className="p-2 cursor-pointer text-gray-400 hover:text-green-600 focus:outline-none"
              >
                <Tooltip
                  id="view"
                  Icon={FiZoomIn}
                  title={t("View")}
                  bgColor="#34D399"
                />
              </Link>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default PrescriptionTable;

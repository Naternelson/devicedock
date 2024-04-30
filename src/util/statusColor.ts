import { Theme } from "@mui/material";
import { OrderStatus } from "../types/Order";

export const statusColor = (theme: Theme, status: OrderStatus) => {
	switch (status) {
		case OrderStatus.PENDING:
			return theme.palette.info.main;
		case OrderStatus.ACTIVE:
			return theme.palette.primary.main;
		case OrderStatus.ERROR:
			return theme.palette.error.main;
		case OrderStatus.COMPLETED:
			return theme.palette.success.main;
		case OrderStatus.CANCELLED:
			return theme.palette.grey[800];
		default:
			return theme.palette.grey[500];
	}
};

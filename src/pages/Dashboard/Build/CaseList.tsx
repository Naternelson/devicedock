import { Stack } from "@mui/material";
import { useBuildContext } from "."
import { Case } from "../../../types/Case";
import { useState } from "react";
import { useCase } from "../../../api/useCase";
import { Product } from "../../../types/Product";
import { Order } from "../../../types/Order";

export const CaseList = (order:Order, product: Product) =>{
    const [targetCase, setTargetCase] = useState<Case | null>(null);
    return <Stack>
        Hi there
    </Stack>
}
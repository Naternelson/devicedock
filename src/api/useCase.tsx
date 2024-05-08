import { useCallback, useEffect, useState } from 'react';
import { Order } from '../types/Order';
import { Product } from '../types/Product';
import { Case, casesCollection } from '../types/Case';
import { deleteDoc, doc, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import { useOrgId } from '../util';

export const useCase = () => {
	const createNextCase = useCallback(
		async (params: { order: Order; product: Product; lastCase?: Case; orgId: string }) => {
			const { order, product, lastCase, orgId } = params;
			const pattern = product.caseIdentifierSchema.pattern;
			const nextCase = nextCaseId(lastCase?.caseId || pattern, pattern);
			const d = doc(casesCollection(orgId));
			const orderCase = new Case();
			orderCase.caseId = nextCase.next;
			orderCase.orderId = order.id as string;
			orderCase.productId = product.id as string;
			orderCase.maxSize = product.caseIdentifierSchema.maxSize;
			return await setDoc(d, orderCase);
		},
		[],
	);

	const destroyEmptyCases = useCallback(async (cases: Case[], orgId: string) => {
		const emptyCases = cases.filter((c) => c.count === 0);
		return await Promise.all(
			emptyCases.map(async (c) => {
				await deleteDoc(doc(casesCollection(orgId), c.id));
			}),
		);
	}, []);

	return {
		createNextCase,
		destroyEmptyCases,
	};
};

const nextCaseId = (previousCaseId: string, pattern: string) => {
	const nextCaseId = toCurrentDate(previousCaseId, pattern);
	return incrementString(nextCaseId.next, pattern, nextCaseId.previous !== nextCaseId.next);
};

const incrementString = (target: string, template: string, reset?: boolean) => {
	let startIndex = 0;
	let newTarget = target;
	template.replace(/#+/g, (match) => {
		startIndex = target.indexOf(match, startIndex);
		const endIndex = startIndex + match.length;
		let number = reset ? 1 : parseInt(target.substring(startIndex, endIndex), 10) + 1;
		newTarget =
			newTarget.substring(0, startIndex) +
			number.toString().padStart(match.length, '0') +
			newTarget.substring(endIndex);
		return match;
	});
	return {
		previous: target,
		next: newTarget,
	};
};

const toCurrentDate = (target: string, template: string) => {
	// Current date components
	const today = new Date();
	const YYYY = today.getFullYear().toString();
	const MM = (today.getMonth() + 1).toString().padStart(2, '0');
	const DD = today.getDate().toString().padStart(2, '0');
	const mm = today.getMinutes().toString().padStart(2, '0');
	const hh = today.getHours().toString().padStart(2, '0');
	const ss = today.getSeconds().toString().padStart(2, '0');

	// Resulting target string initialization
	let newTarget = target;

	// Find each placeholder in the template and replace in target
	for (let i = 0; i < template.length; i++) {
		if (template.substring(i, i + 4) === 'YYYY') {
			newTarget = newTarget.substring(0, i) + YYYY + newTarget.substring(i + 4);
			i += 3;
		} else if (template.substring(i, i + 2) === 'YY') {
			newTarget = newTarget.substring(0, i) + YYYY.substring(2) + newTarget.substring(i + 2);
			i += 1;
		} else if (template.substring(i, i + 2) === 'MM') {
			newTarget = newTarget.substring(0, i) + MM + newTarget.substring(i + 2);
			i += 1;
		} else if (template.substring(i, i + 2) === 'DD') {
			newTarget = newTarget.substring(0, i) + DD + newTarget.substring(i + 2);
			i += 1;
		} else if (template.substring(i, i + 2) === 'hh') {
			newTarget = newTarget.substring(0, i) + hh + newTarget.substring(i + 2);
			i += 1;
		} else if (template.substring(i, i + 2) === 'mm') {
			newTarget = newTarget.substring(0, i) + mm + newTarget.substring(i + 2);
			i += 1;
		} else if (template.substring(i, i + 2) === 'ss') {
			newTarget = newTarget.substring(0, i) + ss + newTarget.substring(i + 2);
			i += 1;
		}
	}

	return {
		previous: target,
		next: newTarget,
	};
};

import type { Root } from "mdast";
import type { VFile } from "vfile";

import { visit } from "unist-util-visit";

export interface RemarkAutoTwoslashOptions {
	/**
	 * Any number of file paths to exclude from twoslash injection.
	 */
	excludes?: RegExp[];
}

/**
 * Automatically adds `twoslash` meta to code blocks in Markdown.
 */
export function remarkAutoTwoslash({
	excludes = [],
}: RemarkAutoTwoslashOptions) {
	return function createTransformer() {
		return function transformer(tree: Root, file: VFile): void {
			const filePath = file.path || "";
			if (excludes.some((exclude) => exclude.test(filePath))) {
				return;
			}

			visit(tree, "code", (node) => {
				if (node.lang?.startsWith("ts")) {
					if (!node.meta?.includes("twoslash")) {
						node.meta = node.meta ? `${node.meta} twoslash` : "twoslash";
					}
				}
			});
		};
	};
}

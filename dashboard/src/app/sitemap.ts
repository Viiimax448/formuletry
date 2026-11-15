import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://www.formuletry.com";

	return [
		{
			url: `${baseUrl}/`,
			lastModified: new Date(),
			changeFrequency: "always",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/dashboard/`,
			lastModified: new Date(),
			changeFrequency: "always",
			priority: 1.0,
		},
	];
}

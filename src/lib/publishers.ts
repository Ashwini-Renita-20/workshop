/**
 * Data-access helpers for publisher records.
 *
 * These helpers are consumed by Astro pages during static builds and keep the
 * database dependency injectable so the same logic can run against the real
 * SQLite database or an in-memory test database.
 */

import { asc } from 'drizzle-orm';
import type { Database } from './db';
import { publishers } from '../../db/schema';
import type { Publisher } from '../types/game';

const publisherSelection = {
    id: publishers.id,
    name: publishers.name,
} as const;

type PublisherRow = {
    id: number;
    name: string;
};

function mapPublisher(row: PublisherRow): Publisher {
    return {
        id: row.id,
        name: row.name,
    };
}

/**
 * Returns all publishers sorted alphabetically by name.
 *
 * The ordering is deterministic so static pages render in a stable order across
 * builds and test runs.
 */
export async function getAllPublishers(db: Database): Promise<Publisher[]> {
    const rows = await db
        .select(publisherSelection)
        .from(publishers)
        .orderBy(asc(publishers.name));

    return rows.map(mapPublisher);
}

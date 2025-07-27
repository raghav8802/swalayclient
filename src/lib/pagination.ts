import { NextRequest } from "next/server";


export interface PaginationOptions {
    page?: number;
    limit?: number;
    maxLimit?: number;
  }
  
  export interface PaginatedResult<T> {
    data: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
      limit: number;
    };
  }
  
  export function getPaginationParams(req: NextRequest): Required<PaginationOptions> {
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    
    return { page, limit, maxLimit: 50 };
  }
  
  export async function paginate<T>(
    query: any,
    options: Required<PaginationOptions>
  ): Promise<PaginatedResult<T>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
  
    const [data, totalItems] = await Promise.all([
      query.skip(skip).limit(limit),
      query.model.countDocuments(query.getFilter())
    ]);
  
    const totalPages = Math.ceil(totalItems / limit);
  
    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit
      }
    };
  }
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Test connection
    await dbConnect();
    
    // Check connection state
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Get database info
    const dbName = mongoose.connection.db?.databaseName;
    const collections = await mongoose.connection.db?.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      status: 'Database connection successful',
      connectionState: states[connectionState as keyof typeof states],
      database: dbName,
      collections: collections?.map(c => c.name) || [],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
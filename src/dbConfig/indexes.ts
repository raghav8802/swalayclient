import Album from '@/models/albums';
import Track from '@/models/track';
import Artist from '@/models/Artists';
import Marketing from '@/models/Marketing';
import Label from '@/models/Label';
import Support from '@/models/Support';
import SupportReply from '@/models/SupportReply';
import Subscription from '@/models/Subscription';
import Lyrics from '@/models/Lyrics';
import PaymentRequest from '@/models/paymentRequest';
import Bank from '@/models/Bank';
import Notification from '@/models/notification';
import OldData from '@/models/oldData';
import Payments from '@/models/Payments';
import TotalBalance from '@/models/totalBalance';
import Youtube from '@/models/youtube';

// ✅ Safe index creation helper function
async function createIndexSafely(collection: any, indexSpec: any, options: any = {}, indexName: string) {
  try {
    // Check if index already exists
    const existingIndexes = await collection.getIndexes();
    const indexExists = Object.keys(existingIndexes).some(name => {
      const index = existingIndexes[name];
      return JSON.stringify(index.key) === JSON.stringify(indexSpec);
    });

    if (indexExists) {
      console.log(`   ⚠️  Index ${indexName} already exists, skipping...`);
      return;
    }

    // Create the index with explicit name to avoid conflicts
    await collection.createIndex(indexSpec, { ...options, name: indexName });
    console.log(`   ✅ Created index: ${indexName}`);
    
  } catch (error: any) {
    if (error.code === 86) {
      // Index already exists with different options
      console.log(`   ⚠️  Index conflict for ${indexName}, skipping...`);
    } else {
      console.log(`   ❌ Failed to create ${indexName}:`, error.message);
    }
  }
}

export async function createOptimizedIndexes() {
  try {
    console.log('🚀 Creating database indexes for ALL models (safe mode)...');

    // 1. ALBUMS - Safe index creation
    console.log('📋 Creating Album indexes...');
    await createIndexSafely(Album.collection, { labelId: 1 }, {}, 'album_labelId_1');
    await createIndexSafely(Album.collection, { status: 1 }, {}, 'album_status_1');
    await createIndexSafely(Album.collection, { labelId: 1, status: 1 }, {}, 'album_labelId_status_1');
    await createIndexSafely(Album.collection, { createdAt: -1 }, {}, 'album_createdAt_-1');
    await createIndexSafely(Album.collection, { language: 1 }, {}, 'album_language_1');
    await createIndexSafely(Album.collection, { genre: 1 }, {}, 'album_genre_1');
    await createIndexSafely(Album.collection, { title: 1 }, {}, 'album_title_1');
    await createIndexSafely(Album.collection, { artist: 1 }, {}, 'album_artist_1');
    
    // Text index with safe fallback
    try {
      await createIndexSafely(
        Album.collection, 
        { title: 'text', artist: 'text' },
        { default_language: 'english', language_override: 'none' },
        'album_text_search'
      );
    } catch (textError) {
      console.log('   ⚠️  Album text index skipped due to language issues');
    }
    console.log('✅ Album indexes completed');

    // 2. TRACKS - Safe index creation
    console.log('📋 Creating Track indexes...');
    await createIndexSafely(Track.collection, { albumId: 1 }, {}, 'track_albumId_1');
    await createIndexSafely(Track.collection, { singers: 1 }, {}, 'track_singers_1');
    await createIndexSafely(Track.collection, { composers: 1 }, {}, 'track_composers_1');
    await createIndexSafely(Track.collection, { lyricists: 1 }, {}, 'track_lyricists_1');
    await createIndexSafely(Track.collection, { producers: 1 }, {}, 'track_producers_1');
    await createIndexSafely(Track.collection, { isrc: 1 }, {}, 'track_isrc_1');
    await createIndexSafely(Track.collection, { songName: 1 }, {}, 'track_songName_1');
    
    try {
      await createIndexSafely(
        Track.collection,
        { songName: 'text' },
        { default_language: 'english', language_override: 'none' },
        'track_songName_text'
      );
    } catch (textError) {
      console.log('   ⚠️  Track text index skipped');
    }
    console.log('✅ Track indexes completed');

    // 3. ARTISTS - Safe index creation
    console.log('📋 Creating Artist indexes...');
    await createIndexSafely(Artist.collection, { labelId: 1 }, {}, 'artist_labelId_1');
    await createIndexSafely(Artist.collection, { artistName: 1 }, {}, 'artist_artistName_1');
    
    try {
      await createIndexSafely(
        Artist.collection,
        { artistName: 'text' },
        { default_language: 'english', language_override: 'none' },
        'artist_artistName_text'
      );
    } catch (textError) {
      console.log('   ⚠️  Artist text index skipped');
    }
    console.log('✅ Artist indexes completed');

    // 4. MARKETING - Safe index creation
    console.log('📋 Creating Marketing indexes...');
    await createIndexSafely(Marketing.collection, { albumId: 1 }, {}, 'marketing_albumId_1');
    await createIndexSafely(Marketing.collection, { labelId: 1 }, {}, 'marketing_labelId_1');
    console.log('✅ Marketing indexes completed');

    // 5. LABELS - Safe index creation (handle existing unique email index)
    console.log('📋 Creating Label indexes...');
    await createIndexSafely(Label.collection, { uniqueUsername: 1 }, {}, 'label_uniqueUsername_1');
    // Skip email index if it already exists as unique
    console.log('   ⚠️  Email index already exists (unique), skipping regular email index');
    console.log('✅ Label indexes completed');

    // 6. SUPPORT - Safe index creation
    console.log('📋 Creating Support indexes...');
    await createIndexSafely(Support.collection, { labelId: 1 }, {}, 'support_labelId_1');
    await createIndexSafely(Support.collection, { status: 1 }, {}, 'support_status_1');
    await createIndexSafely(Support.collection, { ticketId: 1 }, {}, 'support_ticketId_1');
    await createIndexSafely(Support.collection, { createdAt: -1 }, {}, 'support_createdAt_-1');
    await createIndexSafely(Support.collection, { labelId: 1, status: 1 }, {}, 'support_labelId_status_1');
    console.log('✅ Support indexes completed');

    // 7. SUPPORT REPLY - Safe index creation
    console.log('📋 Creating SupportReply indexes...');
    await createIndexSafely(SupportReply.collection, { supportId: 1 }, {}, 'supportreply_supportId_1');
    await createIndexSafely(SupportReply.collection, { createdAt: -1 }, {}, 'supportreply_createdAt_-1');
    console.log('✅ SupportReply indexes completed');

    // 8. SUBSCRIPTIONS - Safe index creation
    console.log('📋 Creating Subscription indexes...');
    await createIndexSafely(Subscription.collection, { userId: 1 }, {}, 'subscription_userId_1');
    await createIndexSafely(Subscription.collection, { status: 1 }, {}, 'subscription_status_1');
    await createIndexSafely(Subscription.collection, { userId: 1, status: 1 }, {}, 'subscription_userId_status_1');
    await createIndexSafely(Subscription.collection, { endDate: 1 }, {}, 'subscription_endDate_1');
    await createIndexSafely(Subscription.collection, { createdAt: -1 }, {}, 'subscription_createdAt_-1');
    console.log('✅ Subscription indexes completed');

    // 9. LYRICS - Safe index creation
    console.log('📋 Creating Lyrics indexes...');
    await createIndexSafely(Lyrics.collection, { trackId: 1 }, {}, 'lyrics_trackId_1');
    await createIndexSafely(Lyrics.collection, { status: 1 }, {}, 'lyrics_status_1');
    console.log('✅ Lyrics indexes completed');

    // 10. PAYMENT REQUESTS - Safe index creation
    console.log('📋 Creating PaymentRequest indexes...');
    await createIndexSafely(PaymentRequest.collection, { labelId: 1 }, {}, 'paymentrequest_labelId_1');
    await createIndexSafely(PaymentRequest.collection, { status: 1 }, {}, 'paymentrequest_status_1');
    await createIndexSafely(PaymentRequest.collection, { labelId: 1, status: 1 }, {}, 'paymentrequest_labelId_status_1');
    await createIndexSafely(PaymentRequest.collection, { request_at: -1 }, {}, 'paymentrequest_request_at_-1');
    console.log('✅ PaymentRequest indexes completed');

    // 11. BANK - Safe index creation
    console.log('📋 Creating Bank indexes...');
    await createIndexSafely(Bank.collection, { labelId: 1 }, {}, 'bank_labelId_1');
    console.log('✅ Bank indexes completed');

    // 12. NOTIFICATIONS - Safe index creation
    console.log('📋 Creating Notification indexes...');
    await createIndexSafely(Notification.collection, { labels: 1 }, {}, 'notification_labels_1');
    await createIndexSafely(Notification.collection, { time: -1 }, {}, 'notification_time_-1');
    await createIndexSafely(Notification.collection, { category: 1 }, {}, 'notification_category_1');
    console.log('✅ Notification indexes completed');

    // 13. PAYMENTS - Safe index creation
    console.log('📋 Creating Payments indexes...');
    await createIndexSafely(Payments.collection, { labelId: 1 }, {}, 'payments_labelId_1');
    await createIndexSafely(Payments.collection, { time: -1 }, {}, 'payments_time_-1');
    await createIndexSafely(Payments.collection, { labelId: 1, time: -1 }, {}, 'payments_labelId_time_-1');
    console.log('✅ Payments indexes completed');

    // 14. TOTAL BALANCE - Safe index creation
    console.log('📋 Creating TotalBalance indexes...');
    await createIndexSafely(TotalBalance.collection, { labelId: 1 }, {}, 'totalbalance_labelId_1');
    console.log('✅ TotalBalance indexes completed');

    // 15. YOUTUBE - Safe index creation
    console.log('📋 Creating Youtube indexes...');
    try {
      await createIndexSafely(Youtube.collection, { labelId: 1 }, {}, 'youtube_labelId_1');
      console.log('✅ Youtube indexes completed');
    } catch (error) {
      console.log('⚠️  Youtube collection might not exist yet');
    }

    // 16. OLD DATA - Safe index creation
    console.log('📋 Creating OldData indexes...');
    try {
      await createIndexSafely(OldData.collection, { labelId: 1 }, {}, 'olddata_labelId_1');
      console.log('✅ OldData indexes completed');
    } catch (error) {
      console.log('⚠️  OldData collection might not exist yet');
    }

    console.log('\n🎉 ALL DATABASE INDEXES COMPLETED!');
    console.log('📊 Total Models Processed: 16/16');
    console.log('✅ Safe mode: Existing indexes preserved, conflicts avoided');
    
  } catch (error) {
    console.error('❌ Critical error in index creation:', error);
    throw error;
  }
}

// Function to check all existing indexes
export async function checkAllIndexes() {
  const collections = [
    { name: 'Albums', collection: Album.collection },
    { name: 'Tracks', collection: Track.collection },
    { name: 'Artists', collection: Artist.collection },
    { name: 'Marketing', collection: Marketing.collection },
    { name: 'Labels', collection: Label.collection },
    { name: 'Support', collection: Support.collection },
    { name: 'SupportReply', collection: SupportReply.collection },
    { name: 'Subscriptions', collection: Subscription.collection },
    { name: 'Lyrics', collection: Lyrics.collection },
    { name: 'PaymentRequest', collection: PaymentRequest.collection },
    { name: 'Bank', collection: Bank.collection },
    { name: 'Notifications', collection: Notification.collection },
    { name: 'Payments', collection: Payments.collection },
    { name: 'TotalBalance', collection: TotalBalance.collection },
  ];

  console.log('🔍 CHECKING ALL INDEXES...\n');
  
  for (const { name, collection } of collections) {
    try {
      const indexes = await collection.listIndexes().toArray();
      console.log(`📋 ${name} Collection (${indexes.length} indexes):`);
      
      indexes.forEach((index: any) => {
        const keyStr = JSON.stringify(index.key);
        const unique = index.unique ? ' [UNIQUE]' : '';
        console.log(`   ✅ ${index.name}: ${keyStr}${unique}`);
      });
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ ${name}: Error accessing collection\n`);
    }
  }
}

// Function to drop conflicting indexes (use with caution!)
export async function dropConflictingIndexes() {
  console.log('⚠️  WARNING: This will drop potentially conflicting indexes');
  console.log('Use only if you understand the implications!\n');
  
  try {
    // Drop the existing email index if you want to recreate it as non-unique
    // await Label.collection.dropIndex('email_1');
    // console.log('✅ Dropped conflicting email index');
    
    console.log('ℹ️  No indexes dropped. Uncomment specific lines if needed.');
  } catch (error) {
    console.error('Error dropping indexes:', error);
  }
}

// Safe function to check what languages exist in your data
export async function checkLanguagesInDatabase() {
  try {
    console.log('🔍 Checking languages in database...');
    
    const languages = await Album.collection.distinct('language');
    console.log('📋 Languages found in Albums:', languages);
    
    const supportedLanguages = [
      'danish', 'dutch', 'english', 'finnish', 'french', 'german', 
      'hungarian', 'italian', 'norwegian', 'portuguese', 'romanian', 
      'russian', 'spanish', 'swedish', 'turkish'
    ];
    
    const unsupportedLanguages = languages.filter(lang => 
      lang && !supportedLanguages.includes(lang.toLowerCase())
    );
    
    if (unsupportedLanguages.length > 0) {
      console.log('⚠️  Unsupported languages for text indexing:', unsupportedLanguages);
      console.log('💡 Consider mapping these to supported languages or using regular indexes');
    }
    
  } catch (error) {
    console.error('Error checking languages:', error);
  }
}
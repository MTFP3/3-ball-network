/**
 * Real Data Service Layer for 3 Ball Network
 * Connects frontend to Firebase backend with real data operations
 */

class DataService {
  constructor() {
    this.db = null;
    this.auth = null;
    this.storage = null;
    this.analytics = null;
    this.initialized = false;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Initialize Firebase services
   */
  async initialize() {
    try {
      // Wait for Firebase to be available
      if (typeof firebase === 'undefined') {
        throw new Error('Firebase not loaded');
      }

      this.db = firebase.firestore();
      this.auth = firebase.auth();
      this.storage = firebase.storage();
      
      // Enable offline persistence
      if (!this.initialized) {
        await this.db.enablePersistence({ synchronizeTabs: true });
      }

      this.initialized = true;
      console.log('✅ DataService initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ DataService initialization failed:', error);
      return false;
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return this.auth?.currentUser;
  }

  /**
   * Cache helper methods
   */
  getCacheKey(collection, id) {
    return `${collection}:${id || 'all'}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Generic Firestore operations
   */
  async create(collection, data, id = null) {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const docData = {
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: user.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      let docRef;
      if (id) {
        docRef = this.db.collection(collection).doc(id);
        await docRef.set(docData);
      } else {
        docRef = await this.db.collection(collection).add(docData);
      }

      console.log(`✅ Created ${collection} document:`, docRef.id);
      
      // Clear cache for this collection
      this.clearCollectionCache(collection);
      
      return { id: docRef.id, ...docData };
    } catch (error) {
      console.error(`❌ Error creating ${collection}:`, error);
      throw error;
    }
  }

  async read(collection, id = null, options = {}) {
    try {
      const cacheKey = this.getCacheKey(collection, id);
      
      // Check cache first
      if (!options.skipCache) {
        const cached = this.getFromCache(cacheKey);
        if (cached) {
          console.log(`📦 Retrieved ${collection} from cache`);
          return cached;
        }
      }

      let result;
      
      if (id) {
        // Get single document
        const doc = await this.db.collection(collection).doc(id).get();
        if (doc.exists) {
          result = { id: doc.id, ...doc.data() };
        } else {
          result = null;
        }
      } else {
        // Get collection with optional filtering
        let query = this.db.collection(collection);
        
        // Apply filters
        if (options.where) {
          options.where.forEach(([field, operator, value]) => {
            query = query.where(field, operator, value);
          });
        }
        
        // Apply ordering
        if (options.orderBy) {
          const [field, direction = 'asc'] = options.orderBy;
          query = query.orderBy(field, direction);
        }
        
        // Apply limit
        if (options.limit) {
          query = query.limit(options.limit);
        }

        const snapshot = await query.get();
        result = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      // Cache the result
      this.setCache(cacheKey, result);
      
      console.log(`✅ Retrieved ${collection}${id ? ` (${id})` : ` (${result?.length || 0} items)`}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Error reading ${collection}:`, error);
      throw error;
    }
  }

  async update(collection, id, data) {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const updateData = {
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: user.uid
      };

      await this.db.collection(collection).doc(id).update(updateData);
      
      console.log(`✅ Updated ${collection} document:`, id);
      
      // Clear cache
      this.clearCollectionCache(collection);
      
      return { id, ...updateData };
    } catch (error) {
      console.error(`❌ Error updating ${collection}:`, error);
      throw error;
    }
  }

  async delete(collection, id) {
    try {
      await this.db.collection(collection).doc(id).delete();
      
      console.log(`✅ Deleted ${collection} document:`, id);
      
      // Clear cache
      this.clearCollectionCache(collection);
      
      return true;
    } catch (error) {
      console.error(`❌ Error deleting ${collection}:`, error);
      throw error;
    }
  }

  clearCollectionCache(collection) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${collection}:`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Real-time subscriptions
   */
  subscribe(collection, callback, options = {}) {
    try {
      let query = this.db.collection(collection);
      
      // Apply filters
      if (options.where) {
        options.where.forEach(([field, operator, value]) => {
          query = query.where(field, operator, value);
        });
      }
      
      // Apply ordering
      if (options.orderBy) {
        const [field, direction = 'asc'] = options.orderBy;
        query = query.orderBy(field, direction);
      }
      
      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const unsubscribe = query.onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          console.log(`🔄 Real-time update for ${collection}:`, data.length);
          callback(data, null);
        },
        (error) => {
          console.error(`❌ Real-time error for ${collection}:`, error);
          callback(null, error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error(`❌ Error subscribing to ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Batch operations
   */
  async batchWrite(operations) {
    try {
      const batch = this.db.batch();
      
      operations.forEach(({ type, collection, id, data }) => {
        const docRef = this.db.collection(collection).doc(id);
        
        switch (type) {
          case 'set':
            batch.set(docRef, data);
            break;
          case 'update':
            batch.update(docRef, data);
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });

      await batch.commit();
      console.log(`✅ Batch operation completed: ${operations.length} operations`);
      
      return true;
    } catch (error) {
      console.error('❌ Batch operation failed:', error);
      throw error;
    }
  }

  /**
   * File upload to Firebase Storage
   */
  async uploadFile(file, path, onProgress = null) {
    try {
      const storageRef = this.storage.ref();
      const fileRef = storageRef.child(path);
      
      const uploadTask = fileRef.put(file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          (error) => {
            console.error('❌ Upload failed:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
              console.log('✅ File uploaded:', downloadURL);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Analytics tracking
   */
  trackEvent(eventName, parameters = {}) {
    try {
      if (this.analytics) {
        firebase.analytics().logEvent(eventName, parameters);
        console.log(`📊 Analytics event: ${eventName}`, parameters);
      }
    } catch (error) {
      console.error('❌ Analytics error:', error);
    }
  }
}

// Create global instance
window.dataService = new DataService();

// Auto-initialize when Firebase is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => window.dataService.initialize(), 1000);
  });
} else {
  setTimeout(() => window.dataService.initialize(), 1000);
}

// Export for ES6 modules
export default DataService;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'المالك',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

CREATE TABLE "Neighborhood" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'الرياض',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Neighborhood_name_key" ON "Neighborhood"("name");
CREATE UNIQUE INDEX "Neighborhood_slug_key" ON "Neighborhood"("slug");

CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "area" INTEGER NOT NULL,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "propertyType" TEXT NOT NULL,
    "listingType" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "whatsapp" TEXT,
    "locationNote" TEXT,
    "advertiserName" TEXT,
    "ownerName" TEXT,
    "ownerPhone" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "neighborhoodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Property_neighborhoodId_propertyType_listingType_idx" ON "Property"("neighborhoodId", "propertyType", "listingType");
CREATE INDEX "Property_featured_idx" ON "Property"("featured");

CREATE TABLE "PropertyImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PropertyImage_propertyId_sortOrder_idx" ON "PropertyImage"("propertyId", "sortOrder");

CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'الوتر المعماري',
    "logoUrl" TEXT,
    "headline" TEXT NOT NULL DEFAULT 'عقارك يبدأ من هنا',
    "subheadline" TEXT,
    "description" TEXT,
    "heroImageUrl" TEXT,
    "primaryButtonText" TEXT NOT NULL DEFAULT 'تصفح العقارات',
    "primaryButtonUrl" TEXT NOT NULL DEFAULT '/properties',
    "secondaryButtonText" TEXT NOT NULL DEFAULT 'تواصل معنا',
    "secondaryButtonUrl" TEXT NOT NULL DEFAULT '#contact',
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "address" TEXT,
    "mapUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#b8954a',
    "secondaryColor" TEXT NOT NULL DEFAULT '#111111',
    "showFeatured" BOOLEAN NOT NULL DEFAULT true,
    "showNeighborhoods" BOOLEAN NOT NULL DEFAULT true,
    "showAbout" BOOLEAN NOT NULL DEFAULT true,
    "showContact" BOOLEAN NOT NULL DEFAULT true,
    "footerText" TEXT,
    "instagram" TEXT,
    "snapchat" TEXT,
    "tiktok" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Property" ADD CONSTRAINT "Property_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "Neighborhood"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

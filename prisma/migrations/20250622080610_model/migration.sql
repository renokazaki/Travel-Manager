/*
  Warnings:

  - You are about to drop the column `clerk_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `target_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `trip_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `clerk_id` on the `member_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `member_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `trip_id` on the `member_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `member_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `clerk_id` on the `payment_details` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `payment_details` table. All the data in the column will be lost.
  - You are about to drop the column `payment_record_id` on the `payment_details` table. All the data in the column will be lost.
  - You are about to drop the column `split_amount` on the `payment_details` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `payment_details` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `payment_records` table. All the data in the column will be lost.
  - You are about to drop the column `is_settled` on the `payment_records` table. All the data in the column will be lost.
  - You are about to drop the column `paid_by` on the `payment_records` table. All the data in the column will be lost.
  - You are about to drop the column `payment_date` on the `payment_records` table. All the data in the column will be lost.
  - You are about to drop the column `trip_id` on the `payment_records` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `payment_records` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `payment_records` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(65,30)`.
  - You are about to drop the column `budget` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `clerk_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `display_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `line_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `pending_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedule_days` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedule_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trip_members` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tripId,clerkId,date]` on the table `member_availabilities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentRecordId,clerkId]` on the table `payment_details` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetId` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetType` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripId` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `member_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripId` to the `member_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `member_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `payment_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentRecordId` to the `payment_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `splitAmount` to the `payment_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `payment_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidBy` to the `payment_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentDate` to the `payment_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripId` to the `payment_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `payment_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "event_status" AS ENUM ('候補', '確定', 'キャンセル', '完了');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "event_type" ADD VALUE 'transportation';
ALTER TYPE "event_type" ADD VALUE 'other';

-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_clerk_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "member_availabilities" DROP CONSTRAINT "member_availabilities_clerk_id_fkey";

-- DropForeignKey
ALTER TABLE "member_availabilities" DROP CONSTRAINT "member_availabilities_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_details" DROP CONSTRAINT "payment_details_clerk_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_details" DROP CONSTRAINT "payment_details_payment_record_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_records" DROP CONSTRAINT "payment_records_paid_by_fkey";

-- DropForeignKey
ALTER TABLE "payment_records" DROP CONSTRAINT "payment_records_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "pending_events" DROP CONSTRAINT "pending_events_suggested_by_fkey";

-- DropForeignKey
ALTER TABLE "pending_events" DROP CONSTRAINT "pending_events_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule_days" DROP CONSTRAINT "schedule_days_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule_events" DROP CONSTRAINT "schedule_events_schedule_day_id_fkey";

-- DropForeignKey
ALTER TABLE "trip_members" DROP CONSTRAINT "trip_members_clerk_id_fkey";

-- DropForeignKey
ALTER TABLE "trip_members" DROP CONSTRAINT "trip_members_trip_id_fkey";

-- DropIndex
DROP INDEX "member_availabilities_trip_id_clerk_id_date_key";

-- DropIndex
DROP INDEX "payment_details_payment_record_id_clerk_id_key";

-- DropIndex
DROP INDEX "users_clerk_id_key";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "clerk_id",
DROP COLUMN "created_at",
DROP COLUMN "target_id",
DROP COLUMN "target_type",
DROP COLUMN "trip_id",
DROP COLUMN "updated_at",
ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "targetId" TEXT NOT NULL,
ADD COLUMN     "targetType" "target_type" NOT NULL,
ADD COLUMN     "tripId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "member_availabilities" DROP COLUMN "clerk_id",
DROP COLUMN "created_at",
DROP COLUMN "trip_id",
DROP COLUMN "updated_at",
ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tripId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "payment_details" DROP COLUMN "clerk_id",
DROP COLUMN "created_at",
DROP COLUMN "payment_record_id",
DROP COLUMN "split_amount",
DROP COLUMN "updated_at",
ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentRecordId" TEXT NOT NULL,
ADD COLUMN     "splitAmount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "payment_records" DROP COLUMN "created_at",
DROP COLUMN "is_settled",
DROP COLUMN "paid_by",
DROP COLUMN "payment_date",
DROP COLUMN "trip_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isSettled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidBy" TEXT NOT NULL,
ADD COLUMN     "paymentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tripId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "budget",
DROP COLUMN "created_at",
DROP COLUMN "end_date",
DROP COLUMN "start_date",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "clerk_id",
DROP COLUMN "created_at",
DROP COLUMN "display_name",
DROP COLUMN "line_id",
DROP COLUMN "profile_image",
DROP COLUMN "updated_at",
ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "lineId" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "pending_events";

-- DropTable
DROP TABLE "schedule_days";

-- DropTable
DROP TABLE "schedule_events";

-- DropTable
DROP TABLE "trip_members";

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "type" "event_type",
    "status" "event_status" NOT NULL DEFAULT '候補',
    "date" DATE,
    "startTime" TIME,
    "endTime" TIME,
    "durationMinutes" INTEGER,
    "order" INTEGER,
    "priority" "priority",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TripToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TripToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TripToUser_B_index" ON "_TripToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "member_availabilities_tripId_clerkId_date_key" ON "member_availabilities"("tripId", "clerkId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "payment_details_paymentRecordId_clerkId_key" ON "payment_details"("paymentRecordId", "clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_availabilities" ADD CONSTRAINT "member_availabilities_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TripToUser" ADD CONSTRAINT "_TripToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TripToUser" ADD CONSTRAINT "_TripToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

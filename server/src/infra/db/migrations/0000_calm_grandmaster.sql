CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"link" text NOT NULL,
	"shortened_link" text NOT NULL,
	"quantity_accesses" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_shortened_link_unique" UNIQUE("shortened_link")
);

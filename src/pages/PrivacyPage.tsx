import { Link } from "react-router-dom";
import { Card, CardTitle, Divider, Muted, Page, Pill, Stack } from "../components/ui";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "When using AuraCue, we may collect the following information.",
      "Account Information: When you create an account we may store your username, email address, and optional profile image. This information is used only to create and maintain your account.",
      "Playlist Data: AuraCue stores information related to playlists you generate or save, including playlist names, generated songs, the AI prompt used to generate playlists, and playlist metadata. This allows you to view and manage your playlists within the application.",
      "Spotify Authorization (Optional): If you connect your Spotify account, AuraCue may access limited data through the Spotify Web API. This may include authorization tokens, permission to create playlists in your Spotify account, and the ability to verify whether tracks exist on Spotify.",
      "AuraCue never receives or stores your Spotify password. Authentication is handled entirely by Spotify using OAuth. If you disconnect Spotify, stored authorization tokens are removed.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: [
      "Your information is used only to operate and improve the application.",
      "Specifically, we use it to provide playlist generation features, store playlists associated with your account, enable Spotify playlist creation with permission, and improve application performance and reliability.",
      "AuraCue does not sell or rent your personal data to third parties.",
    ],
  },
  {
    title: "3. Spotify Integration",
    paragraphs: [
      "AuraCue integrates with the Spotify Web API.",
      "Spotify data is used only to verify tracks recommended by the AI system and create playlists on behalf of the user when permission is granted.",
      "AuraCue does not provide downloadable Spotify content. All music playback occurs through Spotify. AuraCue is not affiliated with or endorsed by Spotify.",
    ],
  },
  {
    title: "4. Data Security",
    paragraphs: [
      "We take reasonable measures to protect user data, including secure authentication tokens, encrypted password hashing, and restricted database access.",
      "However, no method of data transmission or storage is completely secure.",
    ],
  },
  {
    title: "5. Third-Party Services",
    paragraphs: [
      "AuraCue relies on third-party services including Spotify Web API, AI model providers, and cloud hosting providers.",
      "These services may process limited information required to deliver application functionality.",
    ],
  },
  {
    title: "6. Your Rights",
    paragraphs: [
      "You have the ability to update your account information, disconnect Spotify at any time, and delete your account.",
      "Deleting your account will remove associated playlists and personal data stored in AuraCue.",
    ],
  },
  {
    title: "7. Children's Privacy",
    paragraphs: ["AuraCue is not intended for individuals under the age of 13."],
  },
  {
    title: "8. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy periodically. The updated version will be posted on this page with a revised Last Updated date.",
    ],
  },
  {
    title: "9. Contact",
    paragraphs: ["For privacy-related questions, contact: support@auracue.app"],
  },
] as const;

export function PrivacyPage() {
  return (
    <Page>
      <Card
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--panel-strong) 90%, rgba(37, 87, 214, 0.06)) 0%, color-mix(in srgb, var(--panel-strong) 90%, rgba(236, 111, 69, 0.06)) 100%)",
        }}
      >
        <Pill style={{ width: "fit-content", marginBottom: 14 }}>Legal</Pill>
        <CardTitle style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>Privacy Policy</CardTitle>
        <Muted style={{ marginTop: 10 }}>Last Updated: March 2026</Muted>
        <Muted style={{ lineHeight: 1.7 }}>
          AuraCue respects your privacy and is committed to protecting your personal information. This Privacy Policy
          explains how AuraCue collects, uses, and safeguards information when you use the application.
        </Muted>
        <Divider />
        <Stack style={{ gap: 18 }}>
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <CardTitle style={{ fontSize: 20 }}>{section.title}</CardTitle>
              <Stack style={{ gap: 10, marginTop: 10 }}>
                {section.paragraphs.map((paragraph) => (
                  <Muted key={paragraph} style={{ marginTop: 0, lineHeight: 1.75 }}>
                    {paragraph}
                  </Muted>
                ))}
              </Stack>
            </section>
          ))}
        </Stack>
        <Divider />
        <Muted style={{ marginTop: 0 }}>
          Looking for usage terms? <Link to="/terms">Read the Terms of Service</Link>
        </Muted>
      </Card>
    </Page>
  );
}

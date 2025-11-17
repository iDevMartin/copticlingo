import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface TermsOfServiceScreenProps {
  onBack: () => void;
}

export const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backIcon: {
      fontSize: 24,
      color: colors.textPrimary,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    lastUpdated: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    paragraph: {
      fontSize: 16,
      color: colors.textPrimary,
      lineHeight: 24,
      marginBottom: 12,
    },
    bulletPoint: {
      fontSize: 16,
      color: colors.textPrimary,
      lineHeight: 24,
      marginBottom: 8,
      paddingLeft: 16,
    },
    footer: {
      height: 40,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last Updated: November 16, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using CopticLingo, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use the application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            CopticLingo is a free, open-source language learning application designed to teach the Coptic language (primarily Bohairic dialect). The service includes:
          </Text>
          <Text style={styles.bulletPoint}>• Interactive lessons covering the Coptic alphabet, vocabulary, and grammar</Text>
          <Text style={styles.bulletPoint}>• Multiple exercise types including translation, multiple choice, and sentence building</Text>
          <Text style={styles.bulletPoint}>• Progress tracking and gamification features (XP, levels, achievements, streaks)</Text>
          <Text style={styles.bulletPoint}>• Spaced repetition review system</Text>
          <Text style={styles.bulletPoint}>• Unit tests to assess learning progress</Text>
          <Text style={styles.bulletPoint}>• Progress export and import functionality</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Free and Open Source</Text>
          <Text style={styles.paragraph}>
            CopticLingo is provided free of charge and is open-source software. The source code is available on GitHub under an open-source license. Users are free to use, modify, and distribute the application in accordance with the license terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
          <Text style={styles.paragraph}>
            As a user of CopticLingo, you agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Use the application for personal, educational purposes</Text>
          <Text style={styles.bulletPoint}>• Not attempt to reverse engineer, hack, or compromise the application's security</Text>
          <Text style={styles.bulletPoint}>• Not use the application in any way that violates applicable laws or regulations</Text>
          <Text style={styles.bulletPoint}>• Maintain the security of your device and any exported progress files</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Educational Content</Text>
          <Text style={styles.paragraph}>
            The Coptic language content, lessons, and exercises provided in CopticLingo are for educational purposes. While we strive for accuracy:
          </Text>
          <Text style={styles.bulletPoint}>• Content is provided "as is" without warranty of any kind</Text>
          <Text style={styles.bulletPoint}>• We make no guarantees about the completeness or accuracy of linguistic content</Text>
          <Text style={styles.bulletPoint}>• Users should consult additional resources and qualified instructors for comprehensive Coptic language education</Text>
          <Text style={styles.bulletPoint}>• CopticLingo is a supplementary learning tool and not a replacement for formal instruction</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All original content, design, and code in CopticLingo are the intellectual property of the developers. This includes:
          </Text>
          <Text style={styles.bulletPoint}>• Lesson content and structure</Text>
          <Text style={styles.bulletPoint}>• Exercise design and implementation</Text>
          <Text style={styles.bulletPoint}>• User interface and visual design</Text>
          <Text style={styles.bulletPoint}>• Application code and architecture</Text>
          <Text style={styles.paragraph}>
            The Coptic language itself and traditional Coptic texts are part of the public domain cultural heritage.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Data and Privacy</Text>
          <Text style={styles.paragraph}>
            Your use of CopticLingo is also governed by our Privacy Policy. Key points include:
          </Text>
          <Text style={styles.bulletPoint}>• All learning data is stored locally on your device</Text>
          <Text style={styles.bulletPoint}>• We do not collect or transmit personal learning data to external servers</Text>
          <Text style={styles.bulletPoint}>• You have full control over your data and can export or delete it at any time</Text>
          <Text style={styles.bulletPoint}>• Anonymous usage analytics may be collected for the web version</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            CopticLingo is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:
          </Text>
          <Text style={styles.bulletPoint}>• Warranties of merchantability or fitness for a particular purpose</Text>
          <Text style={styles.bulletPoint}>• Warranties that the service will be uninterrupted, timely, secure, or error-free</Text>
          <Text style={styles.bulletPoint}>• Warranties regarding the accuracy, reliability, or completeness of content</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the maximum extent permitted by law, the developers of CopticLingo shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </Text>
          <Text style={styles.bulletPoint}>• Your use or inability to use the service</Text>
          <Text style={styles.bulletPoint}>• Any unauthorized access to or use of our servers and/or any personal information stored therein</Text>
          <Text style={styles.bulletPoint}>• Any bugs, viruses, or other harmful code that may be transmitted through the service</Text>
          <Text style={styles.bulletPoint}>• Any errors or omissions in any content</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Updates and Changes</Text>
          <Text style={styles.paragraph}>
            We reserve the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Modify or discontinue the service at any time without notice</Text>
          <Text style={styles.bulletPoint}>• Update, change, or remove content and features</Text>
          <Text style={styles.bulletPoint}>• Release new versions of the application with changes to functionality</Text>
          <Text style={styles.paragraph}>
            Continued use of CopticLingo after such changes constitutes acceptance of the modified terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Developer Mode</Text>
          <Text style={styles.paragraph}>
            CopticLingo includes a Developer Mode feature for testing and development purposes. When enabled:
          </Text>
          <Text style={styles.bulletPoint}>• All lessons and units are unlocked regardless of progress</Text>
          <Text style={styles.bulletPoint}>• Completed lessons do not count towards XP or achievements</Text>
          <Text style={styles.bulletPoint}>• This mode is intended for developers, testers, and content reviewers only</Text>
          <Text style={styles.bulletPoint}>• Normal progress tracking should be done with Developer Mode disabled</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Termination</Text>
          <Text style={styles.paragraph}>
            You may stop using CopticLingo at any time by simply uninstalling the application. This will remove all locally stored data. We reserve the right to terminate or restrict access to the service for any reason, though given the local-first nature of the app, this primarily applies to web-based features.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms of Service, please contact us through:
          </Text>
          <Text style={styles.bulletPoint}>• GitHub: Open an issue on the CopticLingo repository</Text>
          <Text style={styles.bulletPoint}>• Email: Contact the developer through the GitHub profile</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Severability</Text>
          <Text style={styles.paragraph}>
            If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>16. Entire Agreement</Text>
          <Text style={styles.paragraph}>
            These Terms of Service, together with the Privacy Policy, constitute the entire agreement between you and CopticLingo regarding the use of the service, superseding any prior agreements.
          </Text>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

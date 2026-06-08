import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer'
import type { WealthBlueprintReportInput } from '@/lib/types/reports'
import { ADVISOR_PHONE } from '../constants'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#ffffff', padding: 0 },
  coverPage: { flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', padding: 40 },
  coverBrand: { color: '#F59E0B', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  coverTitle: { color: '#ffffff', fontSize: 26, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 4 },
  coverSub: { color: '#9CA3AF', fontSize: 12, textAlign: 'center', marginBottom: 32 },
  coverScoreBox: { backgroundColor: '#1F2937', borderRadius: 8, padding: 24, alignItems: 'center', marginBottom: 24, width: 200 },
  coverScoreLabel: { color: '#9CA3AF', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  coverScore: { fontSize: 56, fontFamily: 'Helvetica-Bold' },
  coverScoreGrade: { fontSize: 16, marginTop: 4 },
  coverMeta: { color: '#6B7280', fontSize: 10, textAlign: 'center' },
  contentPage: { padding: 40 },
  sectionTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 16, borderBottom: '1px solid #E5E7EB', paddingBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  catName: { fontSize: 11, color: '#374151', width: '40%' },
  barContainer: { width: '40%', height: 8, backgroundColor: '#F3F4F6', borderRadius: 4 },
  barFill: { height: 8, borderRadius: 4 },
  catScore: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111827', width: '15%', textAlign: 'right' },
  catComment: { fontSize: 9, color: '#6B7280', marginTop: 2, marginBottom: 10, paddingLeft: 0 },
  recItem: { marginBottom: 14 },
  recNum: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#F59E0B', marginBottom: 2 },
  recText: { fontSize: 11, color: '#374151', lineHeight: 1.5 },
  aboutBox: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 20, marginBottom: 20 },
  aboutName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 4 },
  aboutTitle: { fontSize: 10, color: '#6B7280', marginBottom: 12 },
  aboutBadge: { fontSize: 9, color: '#F59E0B', backgroundColor: '#FEF3C7', padding: '3 8', borderRadius: 4, marginRight: 6 },
  contactRow: { flexDirection: 'row', marginBottom: 6 },
  contactLabel: { fontSize: 10, color: '#9CA3AF', width: 80 },
  contactValue: { fontSize: 10, color: '#111827', fontFamily: 'Helvetica-Bold' },
  disclaimer: { fontSize: 8, color: '#9CA3AF', marginTop: 20, lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: 8 },
  footerText: { fontSize: 8, color: '#9CA3AF' },
})

function scoreColor(score: number, max: number) {
  const pct = score / max
  if (pct >= 0.8) return '#10B981'
  if (pct >= 0.6) return '#F59E0B'
  return '#EF4444'
}

function gradeColor(grade: string) {
  if (grade === 'A' || grade === 'A+') return '#10B981'
  if (grade === 'B' || grade === 'B+') return '#F59E0B'
  return '#EF4444'
}

export function WealthBlueprintPDF({ data }: { data: WealthBlueprintReportInput }) {
  const { name, results } = data
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Document title={`Wealth Blueprint — ${name}`} author="Ajay Kumar Poddar" creator="Poddar Wealth Management">
      {/* Page 1: Cover */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.coverBrand}>Poddar Wealth Management</Text>
          <Text style={styles.coverTitle}>Your Personal{'\n'}Wealth Blueprint</Text>
          <Text style={styles.coverSub}>Prepared for {name} · {today}</Text>
          <View style={styles.coverScoreBox}>
            <Text style={styles.coverScoreLabel}>Policy Health Score</Text>
            <Text style={[styles.coverScore, { color: gradeColor(results.grade) }]}>
              {results.totalScore}
            </Text>
            <Text style={[styles.coverScoreGrade, { color: gradeColor(results.grade) }]}>
              Grade: {results.grade} · out of {results.maxScore}
            </Text>
          </View>
          <Text style={styles.coverMeta}>IRDAI Authorised · MDRT Member · 31+ Years Experience</Text>
        </View>
      </Page>

      {/* Page 2: Score Breakdown */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <Text style={styles.sectionTitle}>Score Breakdown</Text>
          {results.categories.map((cat, i) => (
            <View key={i}>
              <View style={styles.row}>
                <Text style={styles.catName}>{cat.name}</Text>
                <View style={styles.barContainer}>
                  <View style={[styles.barFill, {
                    width: `${(cat.score / cat.maxScore) * 100}%`,
                    backgroundColor: scoreColor(cat.score, cat.maxScore),
                  }]} />
                </View>
                <Text style={styles.catScore}>{cat.score}/{cat.maxScore}</Text>
              </View>
              <Text style={styles.catComment}>{cat.comment}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Poddar Wealth Management · poddarwealth.com</Text>
          <Text style={styles.footerText}>Page 2</Text>
        </View>
      </Page>

      {/* Page 3: Recommendations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <Text style={styles.sectionTitle}>Personalised Recommendations</Text>
          {results.recommendations.map((rec, i) => (
            <View key={i} style={styles.recItem}>
              <Text style={styles.recNum}>{i + 1}.</Text>
              <Text style={styles.recText}>{rec}</Text>
            </View>
          ))}
          <View style={{ marginTop: 24, backgroundColor: '#FEF3C7', borderRadius: 8, padding: 16 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#92400E', marginBottom: 4 }}>
              Next Steps
            </Text>
            <Text style={{ fontSize: 10, color: '#92400E', lineHeight: 1.6 }}>
              Call Ajay Kumar Poddar at +91 {ADVISOR_PHONE} to discuss these recommendations in detail.
              A 15-minute call can clarify your exact coverage needs and premium estimates.
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Poddar Wealth Management · poddarwealth.com</Text>
          <Text style={styles.footerText}>Page 3</Text>
        </View>
      </Page>

      {/* Page 4: About + Contact */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <Text style={styles.sectionTitle}>About Your Advisor</Text>
          <View style={styles.aboutBox}>
            <Text style={styles.aboutName}>Ajay Kumar Poddar</Text>
            <Text style={styles.aboutTitle}>IRDAI Authorised Insurance Agent · MDRT Member · {"Chairman's"} Club Awardee</Text>
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <Text style={styles.aboutBadge}>MDRT Member</Text>
              <Text style={styles.aboutBadge}>{"Chairman's"} Club</Text>
              <Text style={styles.aboutBadge}>31+ Years</Text>
            </View>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.6 }}>
              Ajay Kumar Poddar has been advising families in Gorakhpur and eastern UP since 1994.
              He has helped over 5,000 families secure their financial future through carefully chosen
              LIC and health insurance plans. His MDRT membership and {"Chairman's"} Club award reflect
              consistent excellence in client service.
            </Text>
          </View>
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Contact Details</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Phone:</Text>
            <Text style={styles.contactValue}>+91 {ADVISOR_PHONE}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>WhatsApp:</Text>
            <Text style={styles.contactValue}>wa.me/91{ADVISOR_PHONE}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Website:</Text>
            <Text style={styles.contactValue}>www.poddarwealth.com</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Office:</Text>
            <Text style={styles.contactValue}>AD Mall Compound, Vijay Chowk, Gorakhpur 273001</Text>
          </View>
          <Text style={styles.disclaimer}>
            This report is AI-generated based on inputs provided by you and should not be construed as
            professional financial advice. Insurance needs vary by individual circumstances. Please contact
            Ajay Kumar Poddar directly for a personalised assessment before making any insurance decisions.
            Poddar Wealth Management is an IRDAI-authorised agency. IRDAI Reg. No. as applicable.
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Poddar Wealth Management · poddarwealth.com</Text>
          <Text style={styles.footerText}>Page 4</Text>
        </View>
      </Page>
    </Document>
  )
}

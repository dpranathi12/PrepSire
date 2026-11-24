from io import BytesIO
from typing import Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

from app.models.careerfit_analysis import CareerFitAnalysis


def generate_report(analysis: CareerFitAnalysis, user_name: str = "Candidate") -> bytes:
    """
    Generates a comprehensive, beautifully styled multi-page PDF report
    containing the complete CareerFit AI match results.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    header_title_style = ParagraphStyle(
        'HeaderTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#4F46E5')
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#64748B')
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#334155')
    )

    badge_style = ParagraphStyle(
        'ScoreBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=32,
        alignment=1, # Center
        textColor=colors.HexColor('#4F46E5')
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1E293B')
    )

    story = []

    # 1. Header Banner
    story.append(Paragraph("PrepSpire AI – CareerFit Analysis Report", header_title_style))
    story.append(Paragraph(f"Candidate: <b>{user_name}</b> &nbsp;|&nbsp; Target Role: <b>{analysis.job_title or 'Software Developer'}</b> &nbsp;|&nbsp; Date: {analysis.created_at.strftime('%B %d, %Y') if analysis.created_at else 'Recent'}", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4F46E5'), spaceAfter=15))

    # 2. Overall Score Card & Breakdown Table
    match_pct = f"{analysis.match_score:.1f}%"
    score_box_data = [
        [
            Paragraph(f"<b>Overall Match Score</b><br/><font size=32><b>{match_pct}</b></font>", badge_style),
            Paragraph(
                f"<b>Score Breakdown:</b><br/>"
                f"• Technical Skills Match (40% weight): <b>{analysis.technical_score:.1f}%</b><br/>"
                f"• Experience & Projects (30% weight): <b>{analysis.experience_score:.1f}%</b><br/>"
                f"• Educational Alignment (15% weight): <b>{analysis.education_score:.1f}%</b><br/>"
                f"• Soft Skills & Culture (15% weight): <b>{analysis.soft_skills_score:.1f}%</b>",
                body_style
            )
        ]
    ]
    score_table = Table(score_box_data, colWidths=[200, 330])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 10))

    # Score Explanation
    if analysis.score_explanation:
        story.append(Paragraph(f"<b>Scoring Rationale:</b> {analysis.score_explanation}", body_style))
        story.append(Spacer(1, 12))

    # 3. Matching Skills & Missing Skills Grid
    story.append(Paragraph("1. Technical & Professional Skills Alignment", section_heading))
    matching_str = ", ".join(analysis.matching_skills or []) or "None identified"
    missing_str = ", ".join(analysis.missing_skills or []) or "None identified"

    skills_data = [
        [
            Paragraph("<b>Matching Skills (Demonstrated in Resume)</b>", table_header_style),
            Paragraph("<b>Missing Required Skills (To Acquire)</b>", table_header_style)
        ],
        [
            Paragraph(matching_str, table_cell_style),
            Paragraph(missing_str, table_cell_style)
        ]
    ]
    skills_table = Table(skills_data, colWidths=[265, 265])
    skills_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#059669')), # Green header
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#DC2626')), # Red header
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 15))

    # 4. Skills to Improve Detailed Breakdown
    if analysis.improvement_skills:
        story.append(Paragraph("2. Skills to Improve (Depth & Production Readiness)", section_heading))
        imp_data = [
            [
                Paragraph("<b>Skill</b>", table_header_style),
                Paragraph("<b>Current Demonstration</b>", table_header_style),
                Paragraph("<b>Company Expectation</b>", table_header_style),
                Paragraph("<b>How to Improve</b>", table_header_style)
            ]
        ]
        for item in analysis.improvement_skills[:5]:
            imp_data.append([
                Paragraph(f"<b>{item.get('skill', '')}</b>", table_cell_style),
                Paragraph(item.get('current_demonstration', ''), table_cell_style),
                Paragraph(item.get('company_expectation', ''), table_cell_style),
                Paragraph(item.get('how_to_improve', ''), table_cell_style)
            ])
        imp_table = Table(imp_data, colWidths=[80, 140, 150, 160])
        imp_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4F46E5')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(imp_table)
        story.append(Spacer(1, 15))

    # 5. Personalized Learning Roadmaps (7-Day & 30-Day)
    story.append(Paragraph("3. Personalized Learning Roadmaps", section_heading))
    if analysis.roadmap_7_day:
        story.append(Paragraph("<b>7-Day Rapid Sprint Plan:</b>", body_style))
        for day_plan in analysis.roadmap_7_day[:5]:
            title = day_plan.get("title", f"Day {day_plan.get('day')}")
            exercise = day_plan.get("coding_exercise", "")
            story.append(Paragraph(f"• <b>{title}:</b> {exercise}", body_style))
        story.append(Spacer(1, 8))

    if analysis.roadmap_30_day:
        story.append(Paragraph("<b>30-Day Comprehensive Master Plan:</b>", body_style))
        for week_plan in analysis.roadmap_30_day:
            w_title = week_plan.get("title", f"Week {week_plan.get('week')}")
            focus = ", ".join(week_plan.get("focus_skills", []))
            story.append(Paragraph(f"• <b>{w_title}</b> (Focus: <i>{focus}</i>)", body_style))
            for task in week_plan.get("practical_tasks", []):
                story.append(Paragraph(f"   - {task}", body_style))
        story.append(Spacer(1, 15))

    # 6. Resume Improvement Suggestions
    if analysis.resume_suggestions:
        story.append(Paragraph("4. Targeted Resume & ATS Optimization", section_heading))
        suggestions = analysis.resume_suggestions
        if isinstance(suggestions, dict):
            # Project improvements
            proj_tips = suggestions.get("project_improvements", [])
            if proj_tips:
                story.append(Paragraph("<b>Project Bullet Optimization:</b>", body_style))
                for pt in proj_tips:
                    story.append(Paragraph(f"• {pt}", body_style))
                story.append(Spacer(1, 6))

            # Missing Keywords
            m_kw = suggestions.get("missing_keywords", [])
            if m_kw:
                story.append(Paragraph(f"<b>Key ATS Terms to Incorporate:</b> {', '.join(m_kw)}", body_style))
                story.append(Spacer(1, 6))

            # Professional wording
            wording = suggestions.get("professional_wording", [])
            if wording:
                story.append(Paragraph("<b>Phrasing Upgrades:</b>", body_style))
                for w in wording:
                    story.append(Paragraph(f"• {w}", body_style))

    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#94A3B8'), spaceAfter=10))
    story.append(Paragraph("<i>Generated by PrepSpire AI – Prepare Smarter. Speak Better. Get Interview Ready.</i>", subtitle_style))

    doc.build(story)
    pdf = buffer.getvalue()
    buffer.close()
    return pdf

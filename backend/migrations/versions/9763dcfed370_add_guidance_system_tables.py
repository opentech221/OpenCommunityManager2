"""Add guidance system tables

Revision ID: 9763dcfed370
Revises: 1319c7e79ff2
Create Date: 2025-07-30 11:13:36.135843

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9763dcfed370'
down_revision = '1319c7e79ff2'
branch_labels = None
depends_on = None


def upgrade():
    # Create organizational_diagnostics table
    op.create_table('organizational_diagnostics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('association_id', sa.Integer(), nullable=False),
        sa.Column('conducted_at', sa.DateTime(), nullable=False),
        sa.Column('conducted_by', sa.String(length=100), nullable=False),
        sa.Column('results', sa.Text(), nullable=False),
        sa.Column('score', sa.Float(), nullable=False),
        sa.Column('recommendations', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['association_id'], ['associations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_organizational_diagnostics_association_id', 'organizational_diagnostics', ['association_id'], unique=False)
    op.create_index('ix_organizational_diagnostics_conducted_at', 'organizational_diagnostics', ['conducted_at'], unique=False)
    
    # Create compliance_checks table
    op.create_table('compliance_checks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('association_id', sa.Integer(), nullable=False),
        sa.Column('check_type', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('last_checked', sa.DateTime(), nullable=False),
        sa.Column('next_due', sa.DateTime(), nullable=True),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('priority', sa.String(length=10), nullable=False),
        sa.Column('auto_fix_available', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['association_id'], ['associations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_compliance_checks_association_id', 'compliance_checks', ['association_id'], unique=False)
    op.create_index('ix_compliance_checks_status', 'compliance_checks', ['status'], unique=False)
    op.create_index('ix_compliance_checks_priority', 'compliance_checks', ['priority'], unique=False)
    
    # Create recommendations table
    op.create_table('recommendations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('association_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('priority', sa.String(length=10), nullable=False),
        sa.Column('impact', sa.String(length=10), nullable=False),
        sa.Column('effort', sa.String(length=10), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('deadline', sa.DateTime(), nullable=True),
        sa.Column('progress', sa.Integer(), nullable=False),
        sa.Column('assigned_to', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['association_id'], ['associations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_recommendations_association_id', 'recommendations', ['association_id'], unique=False)
    op.create_index('ix_recommendations_priority', 'recommendations', ['priority'], unique=False)
    op.create_index('ix_recommendations_status', 'recommendations', ['status'], unique=False)
    
    # Create smart_insights table
    op.create_table('smart_insights',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('association_id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('data_points', sa.Text(), nullable=True),
        sa.Column('confidence_score', sa.Float(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['association_id'], ['associations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_smart_insights_association_id', 'smart_insights', ['association_id'], unique=False)
    op.create_index('ix_smart_insights_type', 'smart_insights', ['type'], unique=False)
    op.create_index('ix_smart_insights_is_active', 'smart_insights', ['is_active'], unique=False)
    
    # Create document_templates table
    op.create_table('document_templates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('template_content', sa.Text(), nullable=False),
        sa.Column('variables', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('usage_count', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_document_templates_category', 'document_templates', ['category'], unique=False)
    op.create_index('ix_document_templates_is_active', 'document_templates', ['is_active'], unique=False)
    
    # Create ai_queries table
    op.create_table('ai_queries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('association_id', sa.Integer(), nullable=False),
        sa.Column('user_query', sa.Text(), nullable=False),
        sa.Column('ai_response', sa.Text(), nullable=False),
        sa.Column('context_data', sa.Text(), nullable=True),
        sa.Column('query_type', sa.String(length=50), nullable=False),
        sa.Column('response_time_ms', sa.Integer(), nullable=True),
        sa.Column('satisfaction_rating', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['association_id'], ['associations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_ai_queries_association_id', 'ai_queries', ['association_id'], unique=False)
    op.create_index('ix_ai_queries_query_type', 'ai_queries', ['query_type'], unique=False)
    op.create_index('ix_ai_queries_created_at', 'ai_queries', ['created_at'], unique=False)


def downgrade():
    # Drop tables in reverse order to handle foreign key constraints
    op.drop_index('ix_ai_queries_created_at', table_name='ai_queries')
    op.drop_index('ix_ai_queries_query_type', table_name='ai_queries')
    op.drop_index('ix_ai_queries_association_id', table_name='ai_queries')
    op.drop_table('ai_queries')
    
    op.drop_index('ix_document_templates_is_active', table_name='document_templates')
    op.drop_index('ix_document_templates_category', table_name='document_templates')
    op.drop_table('document_templates')
    
    op.drop_index('ix_smart_insights_is_active', table_name='smart_insights')
    op.drop_index('ix_smart_insights_type', table_name='smart_insights')
    op.drop_index('ix_smart_insights_association_id', table_name='smart_insights')
    op.drop_table('smart_insights')
    
    op.drop_index('ix_recommendations_status', table_name='recommendations')
    op.drop_index('ix_recommendations_priority', table_name='recommendations')
    op.drop_index('ix_recommendations_association_id', table_name='recommendations')
    op.drop_table('recommendations')
    
    op.drop_index('ix_compliance_checks_priority', table_name='compliance_checks')
    op.drop_index('ix_compliance_checks_status', table_name='compliance_checks')
    op.drop_index('ix_compliance_checks_association_id', table_name='compliance_checks')
    op.drop_table('compliance_checks')
    
    op.drop_index('ix_organizational_diagnostics_conducted_at', table_name='organizational_diagnostics')
    op.drop_index('ix_organizational_diagnostics_association_id', table_name='organizational_diagnostics')
    op.drop_table('organizational_diagnostics')

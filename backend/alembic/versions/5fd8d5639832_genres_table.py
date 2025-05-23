"""genres table

Revision ID: 5fd8d5639832
Revises: 7e42622feac4
Create Date: 2025-04-02 18:05:56.920322

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5fd8d5639832'
down_revision: Union[str, None] = '7e42622feac4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('genre')
    op.drop_table('user_genres')
    op.drop_table('book_waitlist')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('book_waitlist',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('open_library_id', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('title', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('author', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('cover_url', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('status', sa.VARCHAR(length=20), server_default=sa.text("'planToRead'::character varying"), autoincrement=False, nullable=True),
    sa.Column('chapter', sa.INTEGER(), server_default=sa.text('0'), autoincrement=False, nullable=True),
    sa.Column('start_date', sa.DATE(), server_default=sa.text('CURRENT_DATE'), autoincrement=False, nullable=True),
    sa.Column('finished_date', sa.DATE(), autoincrement=False, nullable=True),
    sa.Column('added_at', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=True),
    sa.CheckConstraint("status::text = ANY (ARRAY['currentRead'::character varying, 'completed'::character varying, 'onHold'::character varying, 'dropped'::character varying, 'planToRead'::character varying]::text[])", name='book_waitlist_status_check'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='book_waitlist_user_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='book_waitlist_pkey')
    )
    op.create_table('user_genres',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('genre_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['genre_id'], ['genre.g_id'], name='user_genres_genre_id_fkey', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_genres_user_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='user_genres_pkey')
    )
    op.create_table('genre',
    sa.Column('g_id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('g_id', name='genre_pkey')
    )
    # ### end Alembic commands ###

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/SearchNotes/Pagination';

describe('Pagination 組件', () => {
  it('當 currentPage=1 時，上頁按鈕 disabled，且下一頁可點擊', () => {
    const onPrev = jest.fn();
    const onNext = jest.fn();
    render(<Pagination currentPage={1} totalPages={3} onPrev={onPrev} onNext={onNext} />);

    const prevBtn = screen.getByRole('button', { name: /上一頁/ });
    const nextBtn = screen.getByRole('button', { name: /下一頁/ });
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    // 點擊 disabled 的 prev 不應呼叫 onPrev
    fireEvent.click(prevBtn);
    expect(onPrev).not.toHaveBeenCalled();

    // 點擊 next
    fireEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalled();
  });

  it('當 currentPage=totalPages 時，下一頁 disabled，上頁可點擊', () => {
    const onPrev = jest.fn();
    const onNext = jest.fn();
    render(<Pagination currentPage={5} totalPages={5} onPrev={onPrev} onNext={onNext} />);

    const prevBtn = screen.getByRole('button', { name: /上一頁/ });
    const nextBtn = screen.getByRole('button', { name: /下一頁/ });
    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).toBeDisabled();

    fireEvent.click(nextBtn);
    expect(onNext).not.toHaveBeenCalled();

    fireEvent.click(prevBtn);
    expect(onPrev).toHaveBeenCalled();
  });

  it('顯示當前頁數 / 總頁數', () => {
    render(<Pagination currentPage={2} totalPages={4} onPrev={() => {}} onNext={() => {}} />);
    expect(screen.getByText(/第 2 頁 \/ 共 4 頁/)).toBeInTheDocument();
  });
});

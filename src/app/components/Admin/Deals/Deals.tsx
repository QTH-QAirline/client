"use client";
import React, { useState } from "react";
import styles from "./Deals.module.css";

// Kiểu dữ liệu cho Deals
interface Deal {
  id: string;
  flight_id: string; // Added flight_id
  title: string;
  description: string;
  type: "seasonal" | "route-specific";
  startDate: string;
  endDate: string;
  discountPercentage: number;
  applicableRoutes?: string[];
}

// Kiểu dữ liệu cho News/Announcements
interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: "introduction" | "announcement" | "news";
  publishDate: string;
}

const DealsAndNews: React.FC = () => {
  // State cho khuyến mãi
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "1",
      flight_id: "FL001", // Added flight_id
      title: "Summer Vacation Discount",
      description: "Special 20% off for summer routes",
      type: "seasonal",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      discountPercentage: 20,
      applicableRoutes: ["HCM-HN", "HN-DN"],
    },
  ]);

  // State cho tin tức
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: "1",
      title: "Welcome to Our Airline",
      content:
        "Discover our new services and commitment to customer satisfaction",
      type: "introduction",
      publishDate: "2024-01-15",
    },
  ]);

  // State cho modal khuyến mãi
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({});
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [editingDealId, setEditingDealId] = useState<string | null>(null);

  // State cho modal tin tức
  const [newNewsItem, setNewNewsItem] = useState<Partial<NewsItem>>({});
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  // Xử lý tạo/cập nhật khuyến mãi
  const handleCreateOrUpdateDeal = () => {
    if (editingDealId) {
      // Cập nhật khuyến mãi
      setDeals(
        deals.map((deal) =>
          deal.id === editingDealId ? { ...deal, ...newDeal } : deal
        )
      );
      setEditingDealId(null);
    } else {
      // Tạo khuyến mãi mới
      const deal: Deal = {
        ...newDeal,
        id: (deals.length + 1).toString(),
      } as Deal;
      setDeals([...deals, deal]);
    }
    setNewDeal({});
    setIsDealModalOpen(false);
  };

  // Xử lý xóa khuyến mãi
  const handleDeleteDeal = (id: string) => {
    setDeals(deals.filter((deal) => deal.id !== id));
  };

  // Xử lý tạo/cập nhật tin tức
  const handleCreateOrUpdateNews = () => {
    if (editingNewsId) {
      // Cập nhật tin tức
      setNewsItems(
        newsItems.map((news) =>
          news.id === editingNewsId ? { ...news, ...newNewsItem } : news
        )
      );
      setEditingNewsId(null);
    } else {
      // Tạo tin tức mới
      const newsItem: NewsItem = {
        ...newNewsItem,
        id: (newsItems.length + 1).toString(),
      } as NewsItem;
      setNewsItems([...newsItems, newsItem]);
    }
    setNewNewsItem({});
    setIsNewsModalOpen(false);
  };

  // Xử lý xóa tin tức
  const handleDeleteNews = (id: string) => {
    setNewsItems(newsItems.filter((news) => news.id !== id));
  };

  // Hiển thị modal chỉnh sửa khuyến mãi
  const openDealEditModal = (deal: Deal) => {
    setNewDeal(deal);
    setEditingDealId(deal.id);
    setIsDealModalOpen(true);
  };

  // Hiển thị modal chỉnh sửa tin tức
  const openNewsEditModal = (news: NewsItem) => {
    setNewNewsItem(news);
    setEditingNewsId(news.id);
    setIsNewsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      {/* Phần Khuyến Mãi */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Promotion Management</h2>
          <button
            className={styles.addButton}
            onClick={() => {
              setNewDeal({});
              setEditingDealId(null);
              setIsDealModalOpen(true);
            }}
          >
            Add Promotion
          </button>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Flight ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.flight_id}</td>
                <td>{deal.title}</td>
                <td>
                  {deal.type === "seasonal" ? "Seasonal" : "Route-Specific"}
                </td>
                <td>{deal.startDate}</td>
                <td>{deal.endDate}</td>
                <td>{deal.discountPercentage}%</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => openDealEditModal(deal)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteDeal(deal.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phần Tin Tức và Thông Báo */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>News and Announcements</h2>
          <button
            className={styles.addButton}
            onClick={() => {
              setNewNewsItem({});
              setEditingNewsId(null);
              setIsNewsModalOpen(true);
            }}
          >
            Add News
          </button>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Publish Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsItems.map((news) => (
              <tr key={news.id}>
                <td>{news.title}</td>
                <td>{news.type}</td>
                <td>{news.publishDate}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => openNewsEditModal(news)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteNews(news.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Khuyến Mãi */}
      {isDealModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{editingDealId ? "Edit Promotion" : "Add Promotion"}</h3>
            <input
              type="text"
              placeholder="Flight ID"
              value={newDeal.flight_id || ""}
              onChange={(e) =>
                setNewDeal({ ...newDeal, flight_id: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Promotion Title"
              value={newDeal.title || ""}
              onChange={(e) =>
                setNewDeal({ ...newDeal, title: e.target.value })
              }
            />
            <select
              value={newDeal.type || ""}
              onChange={(e) =>
                setNewDeal({ ...newDeal, type: e.target.value as Deal["type"] })
              }
            >
              <option value="">Select Type</option>
              <option value="seasonal">Seasonal</option>
              <option value="route-specific">Route-Specific</option>
            </select>
            <input
              type="date"
              value={newDeal.startDate || ""}
              onChange={(e) =>
                setNewDeal({ ...newDeal, startDate: e.target.value })
              }
            />
            <input
              type="date"
              value={newDeal.endDate || ""}
              onChange={(e) =>
                setNewDeal({ ...newDeal, endDate: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Discount Percentage"
              value={newDeal.discountPercentage || ""}
              onChange={(e) =>
                setNewDeal({
                  ...newDeal,
                  discountPercentage: Number(e.target.value),
                })
              }
            />
            <div className={styles.modalActions}>
              <button onClick={handleCreateOrUpdateDeal}>
                {editingDealId ? "Update" : "Create"}
              </button>
              <button onClick={() => setIsDealModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tin Tức */}
      {isNewsModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{editingNewsId ? "Edit News" : "Add News"}</h3>
            <input
              type="text"
              placeholder="News Title"
              value={newNewsItem.title || ""}
              onChange={(e) =>
                setNewNewsItem({ ...newNewsItem, title: e.target.value })
              }
            />
            <select
              value={newNewsItem.type || ""}
              onChange={(e) =>
                setNewNewsItem({
                  ...newNewsItem,
                  type: e.target.value as NewsItem["type"],
                })
              }
            >
              <option value="">Select Type</option>
              <option value="introduction">Introduction</option>
              <option value="announcement">Announcement</option>
              <option value="news">News</option>
            </select>
            <textarea
              placeholder="Content"
              value={newNewsItem.content || ""}
              onChange={(e) =>
                setNewNewsItem({ ...newNewsItem, content: e.target.value })
              }
            />
            <input
              type="date"
              value={newNewsItem.publishDate || ""}
              onChange={(e) =>
                setNewNewsItem({ ...newNewsItem, publishDate: e.target.value })
              }
            />
            <div className={styles.modalActions}>
              <button onClick={handleCreateOrUpdateNews}>
                {editingNewsId ? "Update" : "Create"}
              </button>
              <button onClick={() => setIsNewsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsAndNews;

<?php declare(strict_types = 1);

namespace App\Posts;

use Doctrine;
use Kdyby;
use Nette;

/**
 * TODO: QueryObject
 */
class Posts extends Nette\Object
{

	/** @var \Kdyby\Doctrine\EntityDao */
	private $dao;

	/**
	 * @param Kdyby\Doctrine\EntityDao $dao
	 */
	public function __construct(Kdyby\Doctrine\EntityDao $dao)
	{
		$this->dao = $dao;
	}

	/**
	 * @return array
	 */
	public function save($entity = NULL, $relations = NULL)
	{
		$entity = $this->dao->save($entity, $relations);
		return $entity;
	}

	/**
	 * @return \ArrayIterator
	 */
	public function findBy(array $criteria, array $orderBy = NULL, $limit = NULL, $offset = NULL)
	{
		$query = $this->dao->createQueryBuilder('p')
			->whereCriteria($criteria)
			->autoJoinOrderBy((array)$orderBy)
			->leftJoin('p.tags', 'tt')//t already used?
			->addSelect('tt')
			->getQuery();
		$resultSet = new Kdyby\Doctrine\ResultSet($query);
		return $resultSet->applyPaging($offset, $limit)->getIterator();
	}

	/**
	 * @return mixed|null|object
	 */
	public function findOneBy(array $criteria, array $orderBy = NULL)
	{
		return $this->dao->findOneBy($criteria, $orderBy);
	}

	/**
	 * @return mixed
	 */
	public function countBy(array $criteria = [])
	{
		return $this->dao->countBy($criteria);
	}

	/**
	 * @return array
	 */
	public function fulltextSearch($search)
	{
		$where = '';
		$ftMinWordLen = 4; //MySQL: ft_min_word_len
		preg_match_all("~[\\pL\\pN_]+('[\\pL\\pN_]+)*~u", stripslashes($search), $matches);
		foreach ($matches[0] as $part) {
			if (iconv_strlen($part, 'utf-8') < $ftMinWordLen) {
				$accents = ['aá', 'cč', 'dď', 'eéě', 'ií', 'nň', 'oó', 'rř', 'sš', 'tť', 'uúů', 'yý', 'zž'];
				foreach ($accents as $accent) {
					$part = preg_replace("<[$accent]>iu", "[$accent]+", $part);
				}
				$regexp = "REGEXP '[[:<:]]" . addslashes(mb_strtoupper($part, 'UTF-8')) . "[[:>:]]'";
				$where .= " OR (title $regexp OR body $regexp)";
			}
		}

		$em = $this->dao->getEntityManager();
		$rsm = new Doctrine\ORM\Query\ResultSetMapping();
		$rsm->addScalarResult('id', 'id');
		$rsm->addScalarResult('title_score', 'title_score');
		$rsm->addScalarResult('body_score', 'body_score');
		$sql = "SELECT id, 5 * MATCH(title) AGAINST (?) AS title_score, MATCH(body) AGAINST (?) AS body_score
				FROM posts WHERE MATCH(title, body) AGAINST(? IN BOOLEAN MODE)$where
				ORDER BY 5 * MATCH(title) AGAINST (?) + MATCH(body) AGAINST (?) DESC";
		$query = $em->createNativeQuery($sql, $rsm);
		$query->setParameters([$search, $search, $search, $search, $search]);
		$result = $query->getScalarResult();
		$ids = array_map('current', $result);
		//FIXME:WARNING: temporary ugly hack because WHERE id IN (79, 10, 45, 54, 62) doesn't keep order
		$tmp = [];
		foreach ($ids as $key => $value) {
			$relevance = $result[$key]['title_score'];
			$article = $this->findOneBy(['id' => $value, 'publish_date <=' => new \DateTime()]);
			if (empty($article)) {
				continue;
			}
			$tmp[$key . '#' . $relevance] = $article;
		}
		return $tmp;
		//return $this->findBy(array('id' => $ids));
	}

	public function delete($entity, $relations = NULL, $flush = Kdyby\Persistence\ObjectDao::FLUSH)
	{
		$this->dao->delete($entity, $relations, $flush);
	}

}